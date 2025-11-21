//FILTERS
import { IMG_ROLES } from "./images";

// queue types ENG
export const QUEUE_OPTIONS = [
  { value: "RANKED_SOLO_5x5", label: "Ranked Solo/Duo" },
  { value: "RANKED_FLEX_SR", label: "Ranked Flex 5v5" },
];

//tipos de clasificatoria ESP
// export const QUEUE_OPTIONS = [
//   { value: "RANKED_SOLO_5x5", label: "Solo/Dúo Clasificatoria" },
//   { value: "RANKED_FLEX_SR", label: "Flexible 5v5 Clasificatoria" },
// ];

// ranking tiers ENG
export const RANKS_OPTIONS = [
  { value: "CHALLENGER", label: "Challenger" },
  { value: "GRANDMASTER", label: "Grandmaster" },
  { value: "MASTER", label: "Master" },
  { value: "DIAMOND", label: "Diamond" },
  { value: "EMERALD", label: "Emerald" },
  { value: "PLATINUM", label: "Platinum" },
  { value: "GOLD", label: "Gold" },
  { value: "SILVER", label: "Silver" },
  { value: "BRONZE", label: "Bronze" },
  { value: "IRON", label: "Iron" },
];

//rangos de clasificación ESP
// export const RANKS_OPTIONS = [
//   { value: "CHALLENGER", label: "Challenger" },
//   { value: "GRANDMASTER", label: "Gran Maestro" },
//   { value: "MASTER", label: "Maestro" },
//   { value: "DIAMOND", label: "Diamante" },
//   { value: "EMERALD", label: "Esmeralda" },
//   { value: "PLATINUM", label: "Platino" },
//   { value: "GOLD", label: "Oro" },
//   { value: "SILVER", label: "Plata" },
//   { value: "BRONZE", label: "Bronce" },
//   { value: "IRON", label: "Hierro" },
// ];

//honor levels ENG
export const HONOR_OPTIONS = [
  { value: "1", label: "Honor 1" },
  { value: "2", label: "Honor 2" },
  { value: "3", label: "Honor 3" },
  { value: "4", label: "Honor 4" },
  { value: "5", label: "Honor 5" },
];

//divisiones dentro de cada rank
export const TIERS_OPTIONS = [
  { value: "I", label: "I (One)" },
  { value: "II", label: "II (Two)" },
  { value: "III", label: "III (Three)" },
  { value: "IV", label: "IV (Four)" },
];

//roles de juego
export const ROLE_OPTIONS = [
  { value: "ALL", label: "All" },
  {
    value: "TOP",
    label: "Top",
    src: IMG_ROLES.top.src,
    color: "color-purple-900",
  },
  {
    value: "JUNGLE",
    label: "Jungle",
    src: IMG_ROLES.jungle.src,
    color: "color-green-900",
  },
  {
    value: "MID",
    label: "Mid",
    src: IMG_ROLES.mid.src,
    color: "color-blue-900",
  },
  {
    value: "ADC",
    label: "ADC",
    src: IMG_ROLES.adc.src,
    color: "color-red-900",
  },
  {
    value: "SUPPORT",
    label: "Support",
    src: IMG_ROLES.support.src,
    color: "color-yellow-900",
  },
];

//regiones/servidores ENG
export const REGION_OPTIONS = [
  { value: "Global", label: "Global" },
  { value: "EUW", label: "Europe West (EUW)" },
  { value: "EUNE", label: "Europe Nordic & East (EUNE)" },
  { value: "NA", label: "North America (NA)" },
  { value: "LAN", label: "Latin America North (LAN)" },
  { value: "LAS", label: "Latin America South (LAS)" },
  { value: "KR", label: "Korea (KR)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "OCE", label: "Oceania (OCE)" },
  { value: "BR", label: "Brazil (BR)" },
  { value: "TR", label: "Turkey (TR)" },
  { value: "RU", label: "Russia (RU)" },
];

//regiones/servidores ESP
// export const REGION_OPTIONS = [
//   { value: "Global", label: "Global" },
//   { value: "EUW", label: "Europa Oeste (EUW)" },
//   { value: "EUNE", label: "Europa Este/Nórdica (EUNE)" },
//   { value: "NA", label: "Norteamérica (NA)" },
//   { value: "LAN", label: "Latinoamérica Norte (LAN)" },
//   { value: "LAS", label: "Latinoamérica Sur (LAS)" },
//   { value: "KR", label: "Corea (KR)" },
//   { value: "JP", label: "Japón (JP)" },
//   { value: "OCE", label: "Oceanía (OCE)" },
//   { value: "BR", label: "Brasil (BR)" },
//   { value: "TR", label: "Turquía (TR)" },
//   { value: "RU", label: "Rusia (RU)" },
// ];

//versiones de patch
export const PATCH_OPTIONS = [
  { value: "15.20", label: "15.20" },
  { value: "15.21", label: "15.21" },
];
