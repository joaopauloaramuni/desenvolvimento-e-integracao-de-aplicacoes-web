// Pagamento com a Stripe: o servidor cria e consulta os PaymentIntents.
//
// O navegador NUNCA vê a chave secreta: ele chama /api/stripe no próprio site,
// e quem fala com a Stripe é:
//   • em produção, a Vercel Function api/stripe.js
//   • no npm run dev / npm run preview, o vite.config.js
//
// Rotas:
//   POST /api/stripe          { items: [{ id, quantity }], customer: { name, email } }
//        → cria o PaymentIntent e devolve { id, clientSecret, amount, currency }
//   GET  /api/stripe?id=pi_…  → consulta o pagamento direto na Stripe (status,
//                               cartão usado, link do recibo)
//
// Variável de ambiente (SEM o prefixo VITE_, de propósito):
//   STRIPE_SECRET_KEY → chave secreta de TESTE (sk_test_…), em
//                       https://dashboard.stripe.com/test/apikeys
//
// O valor cobrado é calculado AQUI, a partir de src/data/products.js. O
// navegador só diz quais produtos e quantas unidades.
//
// Sem SDK: a API REST da Stripe é chamada com fetch.
// O nome do arquivo começa com "_" para a Vercel NÃO transformá-lo em rota.

import { buildOrder, CURRENCY } from "../src/data/products.js";

export const STRIPE_PATH = "/api/stripe";

const API = "https://api.stripe.com/v1";

const MAX_BODY = 8 * 1024; // bytes
const TIMEOUT_MS = 20_000;
const MIN_AMOUNT = 50; // a Stripe não aceita cobranças abaixo de R$ 0,50

// Limite por visitante (IP) para criar pagamentos
const LIMITS = [
  { windowMs: 60 * 1000, max: 10 }, // 10 por minuto
  { windowMs: 24 * 60 * 60 * 1000, max: 100 }, // 100 por dia
];

/* =====================================================================
   Respostas HTTP
   ===================================================================== */

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

function sendError(res, status, error, message, retryAfter) {
  if (retryAfter) res.setHeader("Retry-After", String(retryAfter));
  sendJson(res, status, { error, message });
}

/* =====================================================================
   Limite por visitante
   ===================================================================== */

const requests = new Map(); // ip → [timestamps]
const MAX_TRACKED_IPS = 5000; // evita crescimento ilimitado do Map (CWE-770)

const ipOf = (req) =>
  String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() ||
  req.socket?.remoteAddress ||
  "desconhecido";

// Registra o pedido e devolve quantos segundos esperar (0 = pode seguir)
function waitSeconds(ip, now = Date.now()) {
  const biggest = Math.max(...LIMITS.map((l) => l.windowMs));
  const recent = (requests.get(ip) ?? []).filter((t) => now - t < biggest);

  if (recent.length === 0) {
    requests.delete(ip);
    // Mapa cheio de visitantes novos: descarta o registro mais antigo
    // antes de criar outro, para não crescer sem limite (memória).
    if (requests.size >= MAX_TRACKED_IPS) {
      requests.delete(requests.keys().next().value);
    }
  }

  for (const { windowMs, max } of LIMITS) {
    const inWindow = recent.filter((t) => now - t < windowMs);
    if (inWindow.length >= max) {
      requests.set(ip, recent);
      return Math.ceil((inWindow[0] + windowMs - now) / 1000);
    }
  }
  recent.push(now);
  requests.set(ip, recent);
  return 0;
}

/* =====================================================================
   Corpo do pedido (a Vercel já entrega req.body; o Vite não)
   ===================================================================== */

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error("too_large");
  }
  return JSON.parse(raw || "{}");
}

/* =====================================================================
   Chamada à API REST da Stripe
   A Stripe recebe os dados como formulário (x-www-form-urlencoded), com
   colchetes para objetos e listas:
     metadata[itens]=...   payment_method_types[]=card   expand[]=latest_charge
   ===================================================================== */

async function stripeFetch(key, path, { method = "GET", params } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // GET leva os parâmetros na URL; POST, no corpo
  const options = { method, headers: { Authorization: `Bearer ${key}` }, signal: controller.signal };
  let url = `${API}${path}`;
  if (method === "GET" && params) url += `?${params}`;
  if (method === "POST") {
    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
    options.body = params;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}

// Erro devolvido pela Stripe → resposta para o navegador
function sendStripeError(res, status, data) {
  const err = data?.error ?? {};
  console.error("Stripe:", status, err.type, err.code, err.message);

  if (status === 401) {
    return sendError(res, 401, "invalid_key", "STRIPE_SECRET_KEY inválida. Confira a chave sk_test_ no .env.local.");
  }
  if (status === 404) {
    return sendError(res, 404, "not_found", "Pagamento não encontrado nesta conta Stripe.");
  }
  if (status === 429) {
    return sendError(res, 429, "rate_limited", "A Stripe recebeu pedidos demais. Tente de novo em instantes.", 5);
  }
  return sendError(res, 502, "stripe_error", err.message ?? `A Stripe respondeu HTTP ${status}.`);
}

// Erro de rede/timeout ao falar com a Stripe
function sendFetchError(res, error) {
  if (error?.name === "AbortError") {
    return sendError(res, 504, "timeout", "A Stripe demorou demais para responder.");
  }
  console.error("Stripe:", error?.message ?? error);
  return sendError(res, 502, "network", "Não foi possível falar com a Stripe agora.");
}

/* =====================================================================
   POST: cria o PaymentIntent
   ===================================================================== */

async function createPayment(req, res, key) {
  const wait = waitSeconds(ipOf(req));
  if (wait > 0) {
    return sendError(res, 429, "rate_limited", "Muitos pagamentos seguidos. Espere um pouco.", wait);
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return sendError(res, 400, "bad_request", "JSON inválido.");
  }

  // Valor calculado no servidor, com os preços do catálogo
  let order;
  try {
    order = buildOrder(body?.items);
  } catch (error) {
    return sendError(res, 400, "invalid_order", error.message);
  }
  if (order.lines.length === 0) {
    return sendError(res, 400, "empty_order", "O carrinho está vazio.");
  }
  if (order.total < MIN_AMOUNT) {
    return sendError(res, 400, "amount_too_small", "O valor mínimo de um pagamento é R$ 0,50.");
  }

  const name = String(body?.customer?.name ?? "").trim().slice(0, 100);
  const email = String(body?.customer?.email ?? "").trim().slice(0, 200);
  const summary = order.lines.map((l) => `${l.quantity}x ${l.product.name}`).join(", ");

  const params = new URLSearchParams();
  params.set("amount", String(order.total));
  params.set("currency", CURRENCY);
  // Só cartão: o formulário fica igual em qualquer conta de teste.
  // Para Pix, boleto, carteiras etc., troque pela linha comentada abaixo (e o
  // paymentMethodTypes em StripePayment.jsx) e ative os métodos em
  // https://dashboard.stripe.com/test/settings/payment_methods
  params.append("payment_method_types[]", "card");
  // params.set("automatic_payment_methods[enabled]", "true");
  params.set("description", `Pedido: ${summary}`.slice(0, 1000));
  if (email.includes("@")) params.set("receipt_email", email);
  // metadata aparece no painel da Stripe (até 500 caracteres por valor).
  // Bom lugar para guardar o id do pedido no SEU banco de dados.
  params.set("metadata[itens]", summary.slice(0, 500));
  if (name) params.set("metadata[cliente]", name);

  let result;
  try {
    result = await stripeFetch(key, "/payment_intents", { method: "POST", params });
  } catch (error) {
    return sendFetchError(res, error);
  }
  if (!result.ok) return sendStripeError(res, result.status, result.data);

  const intent = result.data;
  return sendJson(res, 200, {
    id: intent.id,
    clientSecret: intent.client_secret, // o navegador usa para confirmar ESTE pagamento
    amount: intent.amount,
    currency: intent.currency,
  });
}

/* =====================================================================
   GET: consulta o pagamento (a fonte da verdade é a Stripe, não o navegador)
   ===================================================================== */

async function getPayment(req, res, key) {
  const id = new URL(req.url, "http://localhost").searchParams.get("id") ?? "";
  if (!/^pi_[A-Za-z0-9]{10,}$/.test(id)) {
    return sendError(res, 400, "bad_request", "Informe o id do pagamento (pi_…).");
  }

  // expand[]=latest_charge traz junto a cobrança: cartão usado e link do recibo
  const params = new URLSearchParams([["expand[]", "latest_charge"]]);

  let result;
  try {
    result = await stripeFetch(key, `/payment_intents/${id}`, { params });
  } catch (error) {
    return sendFetchError(res, error);
  }
  if (!result.ok) return sendStripeError(res, result.status, result.data);

  const intent = result.data;
  const charge = typeof intent.latest_charge === "object" ? intent.latest_charge : null;
  const card = charge?.payment_method_details?.card;

  // Só o necessário para a tela de recibo (sem e-mail ou nome do cliente)
  return sendJson(res, 200, {
    id: intent.id,
    status: intent.status, // succeeded | processing | requires_payment_method | ...
    amount: intent.amount,
    currency: intent.currency,
    description: intent.description,
    created: intent.created,
    livemode: intent.livemode,
    card: card ? { brand: card.brand, last4: card.last4 } : null,
    receiptUrl: charge?.receipt_url ?? null,
    error: intent.last_payment_error?.message ?? null,
  });
}

/* =====================================================================
   Handler: /api/stripe
   ===================================================================== */

export async function handleStripe(req, res, env = {}) {
  const key = String(env.STRIPE_SECRET_KEY ?? "").trim();
  if (!key) {
    return sendError(res, 503, "missing_key", "Configure a STRIPE_SECRET_KEY no .env.local ou na Vercel.");
  }

  // Projeto didático: só modo de teste. Para cobrar de verdade, remova este
  // bloco (e leia "Indo para produção" no README).
  if (/^(sk|rk)_live_/.test(key)) {
    return sendError(res, 403, "live_key", "Use a chave de TESTE (sk_test_…). Este projeto não faz cobranças reais.");
  }

  if (req.method === "POST") return createPayment(req, res, key);
  if (req.method === "GET") return getPayment(req, res, key);

  res.setHeader("Allow", "GET, POST");
  return sendError(res, 405, "method_not_allowed", "Use GET ou POST.");
}
