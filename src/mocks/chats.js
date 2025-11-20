//definición base de salas de chat + mensajes de bienvenida
//añadir nuevas salas solo en este array
const chatRoomConfigs = [
    {
        name: "Champions Gamers",
        region: "EUW",
        members: 120,
        welcomeMessages: [
            {
                id: "m-ch-1",
                text: "Welcome to Champions Gamers!",
                offsetMs: 3600_000,
            },
        ],
    },
    {
        name: "Summoners Leaders",
        region: "EUNE",
        members: 85,
        welcomeMessages: [
            {
                id: "m-sl-1",
                text: "Welcome to Summoners Leaders!",
                offsetMs: 7200_000,
            },
        ],
    },
    {
        name: "Player Legends",
        region: "LAN",
        members: 60,
        welcomeMessages: [
            {
                id: "m-pl-1",
                text: "Welcome to Player Legends!",
                offsetMs: 5400_000,
            },
        ],
    },
    {
        name: "Global Strategy",
        region: "Global",
        members: 320,
        welcomeMessages: [
            {
                id: "m-gs-1",
                text: "Welcome to Global Strategy!",
                offsetMs: 900_000,
            },
        ],
    },
    {
        name: "Team Tactics",
        region: "Team Tactics",
        members: 100,
        welcomeMessages: [
            {
                id: "m-tt-1",
                text: "Welcome to Team Tactics!",
                offsetMs: 1080_000,
            },
        ],
    },
    {
        name: "Strategic Planning",
        region: "Strategic Planning",
        members: 120,
        welcomeMessages: [
            {
                id: "m-sp-1",
                text: "Welcome to Strategic Planning!",
                offsetMs: 1260_000,
            },
        ],
    },
];

//salas de chat (para UI)
export const chatRooms = chatRoomConfigs.map(({ name, region, members }) => ({
    name,
    region,
    members,
}));

//mensajes mock por sala (fallback visual si la sala no tiene historial aún)
export const mockMessages = chatRoomConfigs.reduce((acc, room) => {
    acc[room.name] = room.welcomeMessages.map((msg) => ({
        id: msg.id,
        room: room.name,
        text: msg.text,
        createdAt: new Date(Date.now() - msg.offsetMs).toISOString(),
    }));
    return acc;
}, {
    //sala global de comunidad, definida una sola vez aquí
    community: [
        {
            id: "m-comm-1",
            room: "Community",
            text: "Welcome to the community chat.",
            createdAt: new Date(Date.now() - 600_000).toISOString(),
        },
    ],
});

//datos simulados de los chats personales
export const userChats = [
    {
        contact: "ShadowBlade",
        lastMessage: "Nos vemos en la partida",
        timestamp: "Hace 2h",
    },
    { contact: "ArcaneSoul", lastMessage: "¿Jugamos ranked?", timestamp: "Ayer" },
    {
        contact: "MysticFlame",
        lastMessage: "Buen trabajo en el torneo",
        timestamp: "Hace 3 días",
    },
];