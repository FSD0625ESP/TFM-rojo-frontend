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

const CHAMPION_ICONS = [
  "Aatrox",
  "Ahri",
  "Akali",
  "Alistar",
  "Amumu",
  "Anivia",
  "Annie",
  "Ashe",
  "AurelionSol",
  "Azir",
  "Bard",
  "Blitzcrank",
  "Brand",
  "Braum",
  "Caitlyn",
  "Camille",
  "Cassiopeia",
  "ChoGath",
  "Corki",
  "Darius",
];

const NAME_POOL = [
  "Sylas",
  "Morgana",
  "Talon",
  "Ezren",
  "Kael",
  "Nyra",
  "Vex",
  "Riven",
  "Zara",
  "Thorne",
  "Liora",
  "Draven",
  "Kira",
  "Jhin",
  "Soraka",
  "Vayne",
  "Nocturne",
  "Zed",
  "Irelia",
  "Xayah",
  "Kayn",
  "Senna",
  "Ryze",
  "Shen",
  "Taliyah",
  "Yone",
  "Sett",
  "Nami",
  "Ornn",
  "Vi",
  "Renata",
  "Garen",
  "Sona",
  "Jayce",
  "Neeko",
  "Katarina",
  "Fiora",
  "Gragas",
  "Lillia",
  "Pantheon",
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
  const name = NAME_POOL[i % NAME_POOL.length];
  const iconName = CHAMPION_ICONS[i % CHAMPION_ICONS.length];
  const winRate = Math.floor(Math.random() * (76 - 10 + 1)) + 10; //entre 10 y 76
  const pickRate = Math.floor(Math.random() * (28 - 1 + 1)) + 1; //entre 1 y 28
  return {
    id: generateId(i),
    name,
    tier: getRandomItem(TIER_ICONS),
    role: getRandomItem(ROLES),
    winRate,
    pickRate,
    icon: `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${iconName}.png`,
    patch: "15.21",
    region: "Global",
    rank: "EMERALD",
    queue: "RANKED_SOLO_5x5",
  };
});

//datos simulados adicionales para pruebas
const randomChampions = Array.from({ length: 10000 }, (_, i) => {
  const name = NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
  const iconName =
    CHAMPION_ICONS[Math.floor(Math.random() * CHAMPION_ICONS.length)];
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
    name,
    tier,
    role,
    winRate,
    pickRate,
    icon: `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${iconName}.png`,
    patch,
    region,
    rank,
    queue,
  };
});

//exportar datos simulados totales
export const MOCK_CHAMPIONS = [...initialChampions, ...randomChampions];
