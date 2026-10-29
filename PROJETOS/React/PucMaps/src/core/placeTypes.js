// placeTypes.js
// Os tipos de destino do projeto original (BuildingType e AreaType) com o
// nome em português, a cor e o ícone usados no mapa e na lista.
//
// Os ícones SVG são os mesmos do original (code/api/assets/icons). O Vite
// transforma cada import em uma URL, e o mapa carrega a imagem com map.addImage.
import iconAcademic from "../assets/icons/building-academic.svg";
import iconAdmin from "../assets/icons/building-admin.svg";
import iconBank from "../assets/icons/building-bank.svg";
import iconCafeteria from "../assets/icons/building-cafeteria.svg";
import iconClassroom from "../assets/icons/building-classroom.svg";
import iconConstruction from "../assets/icons/building-construction.svg";
import iconGate from "../assets/icons/building-gate.svg";
import iconLab from "../assets/icons/building-lab.svg";
import iconLibrary from "../assets/icons/building-library.svg";
import iconService from "../assets/icons/building-service.svg";
import iconSports from "../assets/icons/building-sports.svg";
import iconUnknown from "../assets/icons/building-unknown.svg";
import iconPark from "../assets/icons/area-park.svg";
import iconParking from "../assets/icons/area-parking_lot.svg";

export const PLACE_TYPES = {
  ACADEMIC: { label: "Acadêmico", color: "#00bcd4", icon: iconAcademic },
  CLASSROOM: { label: "Salas de aula", color: "#2196f3", icon: iconClassroom },
  LAB: { label: "Laboratório", color: "#9c27b0", icon: iconLab },
  LIBRARY: { label: "Biblioteca", color: "#3f51b5", icon: iconLibrary },
  CAFETERIA: { label: "Alimentação", color: "#e91e63", icon: iconCafeteria },
  ADMIN: { label: "Administrativo", color: "#607d8b", icon: iconAdmin },
  SPORTS: { label: "Esportes", color: "#4caf50", icon: iconSports },
  SERVICE: { label: "Serviços", color: "#ff9800", icon: iconService },
  BANK: { label: "Banco", color: "#9e9e9e", icon: iconBank },
  CONSTRUCTION: { label: "Em obras", color: "#ffc107", icon: iconConstruction },
  GATE: { label: "Portaria", color: "#9e9e9e", icon: iconGate },
  PARKING_LOT: { label: "Estacionamento", color: "#795548", icon: iconParking },
  PARK: { label: "Área verde", color: "#2e7d32", icon: iconPark },
  UNKNOWN: { label: "Outros", color: "#9e9e9e", icon: iconUnknown },
};

export const typeInfo = (type) => PLACE_TYPES[type] ?? PLACE_TYPES.UNKNOWN;

// Nome da imagem registrada no mapa para cada tipo (ex.: "icon-ACADEMIC")
export const iconId = (type) => `icon-${type}`;
