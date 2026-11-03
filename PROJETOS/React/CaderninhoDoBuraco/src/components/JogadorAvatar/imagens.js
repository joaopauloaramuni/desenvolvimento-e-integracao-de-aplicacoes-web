// As figuras que podem ser avatar (os ids são os do appConfig.CARTAS_AVATAR)
import damaCopas from "../../assets/images/dama-copas.webp";
import damaEspadas from "../../assets/images/dama-espadas.webp";
import damaOuros from "../../assets/images/dama-ouros.webp";
import damaPaus from "../../assets/images/dama-paus.webp";
import jokerBobo from "../../assets/images/joker-bobo.webp";
import jokerCarta from "../../assets/images/joker-carta.webp";
import valeteCopas from "../../assets/images/valete-copas.webp";
import valeteEspadas from "../../assets/images/valete-espadas.webp";
import valeteOuros from "../../assets/images/valete-ouros.webp";
import valetePaus from "../../assets/images/valete-paus.webp";

const IMAGENS = {
  "dama-copas": damaCopas,
  "dama-espadas": damaEspadas,
  "dama-ouros": damaOuros,
  "dama-paus": damaPaus,
  "valete-copas": valeteCopas,
  "valete-espadas": valeteEspadas,
  "valete-ouros": valeteOuros,
  "valete-paus": valetePaus,
  "joker-carta": jokerCarta,
  "joker-bobo": jokerBobo,
};

export function imagemDaCarta(id) {
  return IMAGENS[id] ?? damaCopas;
}
