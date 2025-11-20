//servicio para funciones auxiliares relacionadas con chats
//centraliza las llamadas a la API relacionadas con chats

//importar función helper para construir URLs de la API
import { buildApiUrl } from "../utils/apiUtils";

export const chatService = {
    //obtener historial de mensajes de una sala/canal
    async getRoomHistory(roomId) {
        const url = buildApiUrl(`/chat/history?room=${encodeURIComponent(roomId)}`);
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load room history");
        return res.json();
    },

    //obtener historial de mensajes privados
    async getPrivateHistory(chatId) {
        const url = buildApiUrl(`/chat/private/history?chatId=${encodeURIComponent(chatId)}`);
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load private history");
        return res.json();
    },

    //obtener lista de conversaciones privadas del usuario
    async getConversations() {
        const url = buildApiUrl("/chat/conversations");
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load conversations");
        return res.json();
    },
};

