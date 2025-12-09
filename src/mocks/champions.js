import {
  QUEUE_OPTIONS,
  RANKS_OPTIONS,
  PATCH_OPTIONS,
  REGION_OPTIONS,
  ROLE_OPTIONS,
} from "../constants/filters";
import { IMG_DEFAULT } from "../constants/images";

const QUEUES = QUEUE_OPTIONS.map((q) => q.value);
const RANKS = RANKS_OPTIONS.map((r) => r.value);
const PATCHES = PATCH_OPTIONS.map((p) => p.value);
const REGIONS = REGION_OPTIONS.map((r) => r.value);
const ROLES = ROLE_OPTIONS.filter((r) => r.value !== "ALL").map((r) => r.value); // excluye "ALL"

// Campeones de League of Legends con sus nombres e iconos correspondientes
// Formato: { name: "Nombre del campeón", icon: "NombreIconoDataDragon" }
const CHAMPIONS = [
  { name: "Sylas", icon: "Sylas" },
  { name: "Morgana", icon: "Morgana" },
  { name: "Talon", icon: "Talon" },
  { name: "Ezreal", icon: "Ezreal" },
  { name: "Karthus", icon: "Karthus" },
  { name: "Kassadin", icon: "Kassadin" },
  { name: "Vex", icon: "Vex" },
  { name: "Riven", icon: "Riven" },
  { name: "Zeri", icon: "Zeri" },
  { name: "Zoe", icon: "Zoe" },
  { name: "Zac", icon: "Zac" },
  { name: "Draven", icon: "Draven" },
  { name: "Karma", icon: "Karma" },
  { name: "Jhin", icon: "Jhin" },
  { name: "Soraka", icon: "Soraka" },
  { name: "Vayne", icon: "Vayne" },
  { name: "Nocturne", icon: "Nocturne" },
  { name: "Zed", icon: "Zed" },
  { name: "Irelia", icon: "Irelia" },
  { name: "Xayah", icon: "Xayah" },
  { name: "Kayn", icon: "Kayn" },
  { name: "Senna", icon: "Senna" },
  { name: "Ryze", icon: "Ryze" },
  { name: "Shen", icon: "Shen" },
  { name: "Taliyah", icon: "Taliyah" },
  { name: "Yone", icon: "Yone" },
  { name: "Sett", icon: "Sett" },
  { name: "Nami", icon: "Nami" },
  { name: "Ornn", icon: "Ornn" },
  { name: "Vi", icon: "Vi" },
  { name: "RenataGlasc", icon: "RenataGlasc" },
  { name: "Garen", icon: "Garen" },
  { name: "Sona", icon: "Sona" },
  { name: "Jayce", icon: "Jayce" },
  { name: "Neeko", icon: "Neeko" },
  { name: "Katarina", icon: "Katarina" },
  { name: "Fiora", icon: "Fiora" },
  { name: "Gragas", icon: "Gragas" },
  { name: "Lillia", icon: "Lillia" },
  { name: "Pantheon", icon: "Pantheon" },
];

//función para generar IDs únicas
//champ-[índice]-[cadena aleatoria]
//ejemplo: champ-5-abc123
function generateId(index) {
  const random = Math.random().toString(36).substring(2, 8);
  return `champ-${index}-${random}`;
}

//función para randomizar arrays
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

//íconos tiers
const TIER_ICONS = [
  IMG_DEFAULT.number1.src,
  IMG_DEFAULT.number2.src,
  IMG_DEFAULT.number3.src,
  IMG_DEFAULT.number4.src,
];

//datos simulados de los 10 campeones para filtros por defecto
const initialChampions = Array.from({ length: 10 }, (_, i) => {
  const poolIndex = i % CHAMPIONS.length;
  const champion = CHAMPIONS[poolIndex];
  const winRate = Math.floor(Math.random() * (76 - 10 + 1)) + 10; //entre 10 y 76
  const pickRate = Math.floor(Math.random() * (28 - 1 + 1)) + 1; //entre 1 y 28
  return {
    id: generateId(i),
    name: champion.name,
    tier: getRandomItem(TIER_ICONS),
    role: getRandomItem(ROLES),
    winRate,
    pickRate,
    icon: `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${champion.icon}.png`,
    patch: "15.21",
    region: "Global",
    rank: "EMERALD",
    queue: "RANKED_SOLO_5x5",
  };
});

//datos simulados adicionales para pruebas
const randomChampions = Array.from({ length: 10000 }, (_, i) => {
  const poolIndex = Math.floor(Math.random() * CHAMPIONS.length);
  const champion = CHAMPIONS[poolIndex];
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  const tier = TIER_ICONS[Math.floor(Math.random() * TIER_ICONS.length)];
  const patch = PATCHES[Math.floor(Math.random() * PATCHES.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const queue = QUEUES[Math.floor(Math.random() * QUEUES.length)];
  const winRate = Math.floor(Math.random() * (76 - 10 + 1)) + 10; //entre 10 y 76
  const pickRate = Math.floor(Math.random() * (28 - 1 + 1)) + 1; //entre 1 y 28

  return {
    id: generateId(i + 10),
    name: champion.name,
    tier,
    role,
    winRate,
    pickRate,
    icon: `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${champion.icon}.png`,
    patch,
    region,
    rank,
    queue,
  };
});

//exportar datos simulados totales
export const MOCK_CHAMPIONS = [...initialChampions, ...randomChampions];
