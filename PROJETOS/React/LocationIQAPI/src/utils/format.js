// Formatação em português para distâncias, tempos, fusos e manobras da rota

const number = (value, digits = 0) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "";
  if (meters < 1000) return `${number(Math.round(meters / 10) * 10)} m`;
  return `${number(meters / 1000, meters < 10000 ? 1 : 0)} km`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "";
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export const formatCoordinates = ([lng, lat]) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

// -10800 → "UTC−03:00"
export function formatOffset(offsetSec) {
  const sign = offsetSec < 0 ? "−" : "+";
  const total = Math.abs(offsetSec) / 60;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
}

// Hora atual num fuso IANA (ex.: "America/Sao_Paulo")
export function localTime(timeZone) {
  try {
    return new Date().toLocaleTimeString("pt-BR", { timeZone, hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/* ---------- Manobras da Directions API → texto ---------- */

const MODIFIERS = {
  uturn: "faça o retorno",
  "sharp right": "vire bem à direita",
  right: "vire à direita",
  "slight right": "mantenha-se à direita",
  straight: "siga em frente",
  "slight left": "mantenha-se à esquerda",
  left: "vire à esquerda",
  "sharp left": "vire bem à esquerda",
};

const on = (name) => (name ? ` na ${name}` : "");
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function maneuverText({ maneuver = {}, name }) {
  const { type, modifier, exit } = maneuver;
  const turn = MODIFIERS[modifier] ?? "siga";

  switch (type) {
    case "depart":
      return `Saia${on(name)}`;
    case "arrive":
      return "Você chegou ao destino";
    case "roundabout":
    case "rotary":
    case "roundabout turn":
      return exit ? `Na rotatória, pegue a ${exit}ª saída${on(name)}` : `Entre na rotatória${on(name)}`;
    case "exit roundabout":
    case "exit rotary":
      return `Saia da rotatória${on(name)}`;
    case "merge":
      return `Entre${on(name)}`;
    case "on ramp":
      return `Pegue o acesso${on(name)}`;
    case "off ramp":
      return `Pegue a saída${on(name)}`;
    case "fork":
      return `Na bifurcação, ${turn.replace("vire", "pegue")}${on(name)}`;
    case "end of road":
      return `No fim da via, ${turn}${on(name)}`;
    case "new name":
    case "continue":
      return modifier && modifier !== "straight" ? `${capitalize(turn)}${on(name)}` : `Continue${on(name)}`;
    default:
      return `${capitalize(turn)}${on(name)}`;
  }
}
