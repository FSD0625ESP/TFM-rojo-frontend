import {
  QUEUE_OPTIONS,
  RANKS_OPTIONS,
  PATCH_OPTIONS,
  REGION_OPTIONS,
  ROLE_OPTIONS,
} from "../constants/filters";

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

function generateId(index) {
  const random = Math.random().toString(36).substring(2, 8);
  return `champ-${index}-${random}`;
}

//datos simulados de campeones para filtros por defecto
const initialChampions = Array.from({ length: 10 }, (_, i) => {
  const name = NAME_POOL[i % NAME_POOL.length];
  const iconName = CHAMPION_ICONS[i % CHAMPION_ICONS.length];
  return {
    id: generateId(i),
    name,
    tier: ["S", "A", "B", "C"][i % 4],
    role: ROLES[i % ROLES.length],
    winRate: 50 + (i % 5),
    pickRate: 5 + (i % 10),
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
  const tier = ["S", "A", "B", "C"][Math.floor(Math.random() * 4)];
  const patch = PATCHES[Math.floor(Math.random() * PATCHES.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const rank = RANKS[Math.floor(Math.random() * RANKS.length)];
  const queue = QUEUES[Math.floor(Math.random() * QUEUES.length)];
  const winRate = Math.floor(Math.random() * 11) + 45; // 45–55%
  const pickRate = Math.floor(Math.random() * 15) + 2; // 2–16%

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
