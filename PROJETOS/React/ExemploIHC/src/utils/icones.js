import { FiAperture, FiFilm, FiMic, FiMonitor, FiRadio, FiSpeaker, FiTv } from "react-icons/fi";

// Ícone de cada tipo de recurso (sempre acompanhado do nome em texto)
const ICONES_TIPO = {
  "Data Show": FiAperture,
  Retroprojetor: FiFilm,
  Televisão: FiTv,
  "Televisão e DVD": FiMonitor,
  "Aparelho de Som": FiRadio,
  "Caixa Amplificada": FiSpeaker,
  Microfone: FiMic,
};

export function iconeDoTipo(tipo) {
  return ICONES_TIPO[tipo] ?? FiMonitor;
}
