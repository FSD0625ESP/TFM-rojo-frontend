//tipos de clasificatoria
export const QUEUE_OPTIONS = [
  { value: "RANKED_SOLO_5x5", label: "Solo/Dúo Clasificatoria" },
  { value: "RANKED_FLEX_SR", label: "Flexible 5v5 Clasificatoria" },
];

//rangos de clasificación
export const TIER_OPTIONS = [
  { value: "CHALLENGER", label: "Challenger" },
  { value: "GRANDMASTER", label: "Gran Maestro" },
  { value: "MASTER", label: "Maestro" },
  { value: "DIAMOND", label: "Diamante" },
  { value: "EMERALD", label: "Esmeralda" },
  { value: "PLATINUM", label: "Platino" },
  { value: "GOLD", label: "Oro" },
  { value: "SILVER", label: "Plata" },
  { value: "BRONZE", label: "Bronce" },
  { value: "IRON", label: "Hierro" },
];

//divisiones dentro de cada tier
export const DIVISION_OPTIONS = [
  { value: "I", label: "I (Uno)" },
  { value: "II", label: "II (Dos)" },
  { value: "III", label: "III (Tres)" },
  { value: "IV", label: "IV (Cuatro)" },
];

//roles de juego
export const ROLE_OPTIONS = [
  { value: "TOP", label: "Top" },
  { value: "JUNGLE", label: "Jungla" },
  { value: "MID", label: "Mid" },
  { value: "ADC", label: "ADC" },
  { value: "SUPPORT", label: "Support" },
];

//regiones/servidores
export const REGION_OPTIONS = [
  { value: "EUW", label: "Europa Oeste (EUW)" },
  { value: "EUNE", label: "Europa Este/Nórdica (EUNE)" },
  { value: "NA", label: "Norteamérica (NA)" },
  { value: "LAN", label: "Latinoamérica Norte (LAN)" },
  { value: "LAS", label: "Latinoamérica Sur (LAS)" },
  { value: "KR", label: "Corea (KR)" },
  { value: "JP", label: "Japón (JP)" },
  { value: "OCE", label: "Oceanía (OCE)" },
  { value: "BR", label: "Brasil (BR)" },
  { value: "TR", label: "Turquía (TR)" },
  { value: "RU", label: "Rusia (RU)" },
];
