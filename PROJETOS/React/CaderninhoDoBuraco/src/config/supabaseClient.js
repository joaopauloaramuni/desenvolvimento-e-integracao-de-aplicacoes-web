import { createClient } from "@supabase/supabase-js";

/**
 * Cliente do Supabase, criado uma vez só e compartilhado pelo projeto.
 *
 * O navegador não abre conexão direta com o Postgres: o supabase-js fala com
 * a Data API do Supabase (HTTPS) usando a chave PUBLICÁVEL. Quem decide o que
 * pode ser lido e gravado é o RLS do supabase_buraco.sql, e não a chave.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

/** false quando o .env.local não foi preenchido: a tela abre com um aviso. */
export const supabaseConfigurado = Boolean(url && key);

export const supabase = supabaseConfigurado
  ? createClient(url, key, {
      // Não há login neste projeto: nada de sessão no localStorage.
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
