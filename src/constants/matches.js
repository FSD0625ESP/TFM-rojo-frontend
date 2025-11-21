import { USERS_MOCKS } from "../mocks/usersMocks";
import {
  RANKS_OPTIONS,
  TIERS_OPTIONS,
  HONOR_OPTIONS,
  ROLE_OPTIONS,
} from "./filters";

//extraer valores de los arrays de filters
const RANKS = RANKS_OPTIONS.map((rank) => rank.label);
const TIERS = TIERS_OPTIONS.map((tier) => tier.value);
const HONOR_LEVELS = HONOR_OPTIONS.map((honor) => honor.label);
//filtrar "ALL" y convertir a minúsculas para los roles
const ROLES = ROLE_OPTIONS.filter((role) => role.value !== "ALL").map((role) =>
  role.value.toLowerCase()
);

//generar colores de roles desde ROLE_OPTIONS
//mapear los colores de ROLE_OPTIONS a formato border-{color}
const roleColorMap = {
  "color-purple-900": "border-purple-700",
  "color-green-900": "border-green-700",
  "color-blue-900": "border-blue-700",
  "color-red-900": "border-red-700",
  "color-yellow-900": "border-yellow-500",
};

export const ROLE_COLORS = ROLE_OPTIONS.filter(
  (role) => role.value !== "ALL"
).reduce((acc, role) => {
  const roleKey = role.value.toLowerCase();
  const borderColor = roleColorMap[role.color] || "border-gray-900";
  acc[roleKey] = borderColor;
  return acc;
}, {});

//función auxiliar para elegir un elemento aleatorio
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

//función para generar un tier aleatorio
const generateTier = () => {
  const rank = getRandomItem(RANKS);
  const tier = getRandomItem(TIERS);
  return `${rank} ${tier}`;
};

//función para transformar USERS_MOCKS en formato PLAYERS
const transformUserToPlayer = (user) => {
  return {
    id: user.id,
    name: user.userName,
    tier: generateTier(),
    honor: getRandomItem(HONOR_LEVELS),
    role: getRandomItem(ROLES),
    avatar: user.avatar,
    likedByUser: false,
    likedUser: Math.random() > 0.5, // 50% de probabilidad de que haya dado like
  };
};

//jugadores para el GG Match (transformados desde USERS_MOCKS)
export const PLAYERS = USERS_MOCKS.map(transformUserToPlayer);
