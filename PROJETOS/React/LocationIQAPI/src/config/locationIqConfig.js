// locationIqConfig.js
// O token do LocationIQ vem do .env.local (VITE_LOCATIONIQ_TOKEN).
//
// Por que aqui pode ter VITE_ (e nos outros projetos não)?
// O token de acesso do LocationIQ (começa com "pk.") é usado direto pelo
// navegador: o mapa baixa os blocos com ele e as buscas também. A proteção é
// a restrição por HTTP Referrer (o endereço do seu site) no painel do
// LocationIQ (veja o README).
const LOCATIONIQ_CONFIG = {
  TOKEN: import.meta.env.VITE_LOCATIONIQ_TOKEN,

  // Região dos servidores: "us1" (EUA) ou "eu1" (Europa). As duas aceitam o mesmo token.
  API_URL: "https://us1.locationiq.com/v1",
  // O autocomplete fica num endereço próprio
  AUTOCOMPLETE_URL: "https://api.locationiq.com/v1/autocomplete",
  STATIC_MAP_URL: "https://maps.locationiq.com/v3/staticmap",
  TILES_URL: "https://tiles.locationiq.com/v3",

  // Posição inicial: [longitude, latitude] (o MapLibre usa lng antes de lat!)
  CENTER: [-44.06, -19.93],
  ZOOM: 10.2,

  // Respostas em português e só do Brasil
  LANGUAGE: "pt-BR",
  COUNTRY: "br",

  // Plano gratuito: 2 requisições por segundo. O serviço espera esse
  // intervalo entre uma chamada e outra para não levar erro 429.
  MIN_INTERVAL_MS: 550,

  // Estilos de mapa (vector tiles do LocationIQ, desenhados pelo MapLibre)
  STYLES: [
    { id: "streets", label: "Ruas" },
    { id: "light", label: "Claro" },
    { id: "dark", label: "Escuro" },
  ],

  // Perfis de rota da Directions API
  PROFILES: [
    { id: "driving", label: "Carro" },
    { id: "walking", label: "A pé" },
    { id: "cycling", label: "Bicicleta" },
  ],

  // Categorias da Nearby API (parâmetro tag)
  NEARBY_TAGS: [
    { id: "restaurant", label: "Restaurantes" },
    { id: "cafe", label: "Cafés" },
    { id: "pharmacy", label: "Farmácias" },
    { id: "hospital", label: "Hospitais" },
    { id: "atm", label: "Caixas eletrônicos" },
    { id: "fuel", label: "Postos" },
    { id: "parking", label: "Estacionamentos" },
    { id: "school", label: "Escolas" },
  ],
  NEARBY_RADIUS: [500, 1000, 2000, 5000],
};

export const styleUrl = (id) => `${LOCATIONIQ_CONFIG.TILES_URL}/${id}/vector.json?key=${LOCATIONIQ_CONFIG.TOKEN}`;

export default LOCATIONIQ_CONFIG;
