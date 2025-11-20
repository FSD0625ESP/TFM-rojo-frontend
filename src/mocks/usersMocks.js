import { IMG_AVATAR_MOCKS } from "../constants/images";

//pool de usernames mocks
const USERNAME_POOL = [
    "ShadowBlade",
    "ArcaneSoul",
    "MysticFlame",
    "DragonSlayer",
    "NightHunter",
    "CrystalMage",
    "IronGuardian",
    "SilentArrow",
    "StormCaller",
    "VoidWalker",
    "LunarKnight",
    "RiftRunner",
];

//convertir IMG_AVATAR_MOCKS en una lista utilizable
const AVATAR_LIST = Object.values(IMG_AVATAR_MOCKS);

//función auxiliar para elegir un elemento aleatorio
const getRandomItem = (array) =>
    array[Math.floor(Math.random() * array.length)];

//genera un ID legible para los usuarios mocks
function generateUserId(index) {
    const random = Math.random().toString(36).substring(2, 8);
    return `user-${index}-${random}`;
}

//usuarios mocks que se pueden usar en los chats
export const USERS_MOCKS = Array.from({ length: 50 }, (_, i) => {
    const name = USERNAME_POOL[i % USERNAME_POOL.length];
    const avatar = getRandomItem(AVATAR_LIST);

    return {
        id: generateUserId(i),
        userName: name,
        avatar: avatar.src,
        avatarAlt: avatar.alt,
    };
});


