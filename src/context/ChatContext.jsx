import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { buildApiUrl } from "../utils/apiUtils";

const ChatContext = createContext();

//obtener la URL base de la API
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

//provider para envolver la aplicación y centralizar toda la lógica de chats
export function ChatProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const { socket, connected } = useSocket();

    //estado de mensajes por sala/canal (clave: roomId, valor: array de mensajes)
    const [messages, setMessages] = useState({});

    //estado de mensajes privados por chat (clave: chatId, valor: array de mensajes)
    const [privateMessages, setPrivateMessages] = useState({});

    //salas activas del usuario (Set para evitar duplicados)
    const [activeRooms, setActiveRooms] = useState(new Set());

    //conteos de usuarios por sala (clave: roomId, valor: número de usuarios)
    const [roomCounts, setRoomCounts] = useState({});

    //chats privados activos (Set para evitar duplicados)
    const [activePrivateChats, setActivePrivateChats] = useState(new Set());

    //lista de conversaciones privadas del usuario (desde la BD)
    const [conversations, setConversations] = useState([]);

    //mapa de userId -> estado de conexión (para otros usuarios)
    const [userConnectionStatus, setUserConnectionStatus] = useState(new Map());

    //cargar lista de conversaciones privadas del usuario desde la BD
    const loadConversations = useCallback(async () => {
        try {
            const conversationsUrl = buildApiUrl("/chat/conversations");
            const res = await fetch(conversationsUrl, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setConversations(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("[ChatContext] Error loading conversations:", error);
        }
    }, []);

    //eliminar una conversación privada y todos sus mensajes
    const deleteConversation = useCallback(async (conversationId) => {
        try {
            const deleteUrl = buildApiUrl("/chat/conversation");
            const res = await fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ conversationId }),
            });

            if (res.ok) {
                const data = await res.json();
                
                //si se eliminó permanentemente, eliminar del estado local
                //si no, solo recargar las conversaciones para que se filtre
                if (data.permanentlyDeleted) {
                    //eliminar la conversación del estado local
                    setConversations((prev) =>
                        prev.filter((conv) => conv.conversationId !== conversationId)
                    );

                    //eliminar los mensajes del estado local
                    setPrivateMessages((prev) => {
                        const updated = { ...prev };
                        delete updated[conversationId];
                        return updated;
                    });
                } else {
                    //recargar conversaciones para que se filtre la eliminada
                    await loadConversations();
                }

                //si la conversación estaba abierta, cerrarla
                if (activePrivateChats.has(conversationId)) {
                    setActivePrivateChats((prev) => {
                        const updated = new Set(prev);
                        updated.delete(conversationId);
                        return updated;
                    });
                }

                return { success: true, ...data };
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete conversation");
            }
        } catch (error) {
            console.error("[ChatContext] Error deleting conversation:", error);
            throw error;
        }
    }, [activePrivateChats, loadConversations]);

    //registrar usuario cuando se conecta el socket
    useEffect(() => {
        if (!socket || !isAuthenticated || !user) {
            return;
        }

        const userId = user._id || user.id;
        if (!userId) return;

        const registerUser = () => {
            if (socket.connected) {
                //registrar usuario en el servidor
                socket.emit("register_user", userId);
            }
        };

        //registrar cuando se conecta
        if (socket.connected) {
            registerUser();
        }

        //registrar cuando se reconecta
        socket.on("connect", registerUser);
        socket.on("reconnect", registerUser);

        return () => {
            socket.off("connect", registerUser);
            socket.off("reconnect", registerUser);
        };
    }, [socket, isAuthenticated, user]);

    //configurar listeners de eventos cuando el socket esté disponible
    useEffect(() => {
        if (!socket || !isAuthenticated) {
            return;
        }

        //escuchar nuevos mensajes en salas/canales públicos
        socket.on("chat:new", (msg) => {
            const roomId = msg.room || msg.channel;
            if (roomId) {
                setMessages((prev) => {
                    const roomMessages = prev[roomId] || [];
                    const incomingId = msg.id || msg._id;

                    //evitar duplicados de mensajes
                    if (incomingId && roomMessages.some((m) => (m.id || m._id) === incomingId)) {
                        return prev;
                    }

                    //agregar nuevo mensaje a la sala correspondiente
                    return {
                        ...prev,
                        [roomId]: [...roomMessages, msg],
                    };
                });
            }
        });

        //escuchar mensajes privados
        socket.on("chat:private:new", (msg) => {
            const conversationId = msg.conversationId;
            if (conversationId) {
                setPrivateMessages((prev) => {
                    const chatMessages = prev[conversationId] || [];
                    const incomingId = msg.id || msg._id;

                    //evitar duplicados
                    if (incomingId && chatMessages.some((m) => (m.id || m._id) === incomingId)) {
                        return prev;
                    }

                    //agregar nuevo mensaje al chat privado correspondiente
                    return {
                        ...prev,
                        [conversationId]: [...chatMessages, msg],
                    };
                });

                //actualizar lista de conversaciones para actualizar orden
                loadConversations();
            }
        });

        //escuchar actualizaciones de conteo de usuarios en salas
        socket.on("room:count", ({ room, count }) => {
            setRoomCounts((prev) => ({ ...prev, [room]: count }));
        });

        //escuchar cambios de estado de conexión de usuarios
        socket.on("user:connection_status", ({ userId, isConnected }) => {
            setUserConnectionStatus((prev) => {
                const newMap = new Map(prev);
                newMap.set(userId, isConnected);
                return newMap;
            });
        });

        //escuchar errores del socket
        socket.on("error", (error) => {
            console.error("[ChatContext] Socket error:", error);
        });

        //limpiar listeners al desmontar o cambiar de socket
        return () => {
            socket.off("chat:new");
            socket.off("chat:private:new");
            socket.off("room:count");
            socket.off("user:connection_status");
            socket.off("error");
        };
    }, [socket, isAuthenticated, loadConversations]);

    //cargar conversaciones cuando el usuario esté autenticado y el socket esté conectado
    useEffect(() => {
        if (isAuthenticated && connected) {
            loadConversations();
        }
    }, [isAuthenticated, connected, loadConversations]);

    //cargar historial de mensajes de una sala/canal
    const loadRoomHistory = useCallback(async (roomId) => {
        try {
            //usar función helper para construir la URL
            const historyUrl = buildApiUrl(`/chat/history?room=${encodeURIComponent(roomId)}`);

            const res = await fetch(historyUrl, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                //solo actualizar si hay mensajes
                if (Array.isArray(data) && data.length > 0) {
                    setMessages((prev) => ({
                        ...prev,
                        [roomId]: data,
                    }));
                }
            }
        } catch (error) {
            console.error("[ChatContext] Error loading room history:", error);
        }
    }, []);

    //cargar historial de mensajes privados desde la BD
    const loadPrivateHistory = useCallback(async (conversationId) => {
        try {
            const historyUrl = buildApiUrl(`/chat/private/history?conversationId=${encodeURIComponent(conversationId)}`);
            const res = await fetch(historyUrl, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPrivateMessages((prev) => ({
                        ...prev,
                        [conversationId]: data,
                    }));

                    //actualizar el contador de no leídos en la lista de conversaciones
                    //ya que el backend marca los mensajes como leídos al cargar el historial
                    setConversations((prev) =>
                        prev.map((conv) =>
                            conv.conversationId === conversationId
                                ? { ...conv, unreadCount: 0 }
                                : conv
                        )
                    );

                    //recargar conversaciones para asegurar sincronización con el servidor
                    loadConversations();
                }
            }
        } catch (error) {
            console.error("[ChatContext] Error loading private history:", error);
        }
    }, [loadConversations]);

    //unirse a una sala/canal
    const joinRoom = useCallback((roomId) => {
        if (!socket || !connected) return;

        socket.emit("room:join", roomId, (res) => {
            if (res?.ok) {
                //agregar sala a las activas
                setActiveRooms((prev) => new Set([...prev, roomId]));
                //cargar historial de la sala
                loadRoomHistory(roomId);
            }
        });
    }, [socket, connected, loadRoomHistory]);

    //salir de una sala/canal
    const leaveRoom = useCallback((roomId) => {
        if (!socket || !connected) return;

        socket.emit("room:leave", roomId);
        //remover sala de las activas
        setActiveRooms((prev) => {
            const newSet = new Set(prev);
            newSet.delete(roomId);
            return newSet;
        });
    }, [socket, connected]);

    //enviar mensaje a una sala/canal
    const sendRoomMessage = useCallback((roomId, text) => {
        if (!socket || !connected || !text?.trim()) return;

        //preparar datos del remitente
        const sender = user
            ? {
                id: user._id || user.id,
                userName: user.userName,
                avatar: user.avatar,
            }
            : null;

        //enviar mensaje al servidor
        socket.emit(
            "chat:send",
            { text: text.trim(), room: roomId, user: sender },
            (res) => {
                if (!res?.ok) {
                    console.error("[ChatContext] Send message error:", res?.error);
                }
            }
        );
    }, [socket, connected, user]);

    //iniciar o unirse a un chat privado con otro usuario
    const startPrivateChat = useCallback(async (userId) => {
        try {
            const url = buildApiUrl("/chat/conversation");
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                const data = await res.json();
                const conversationId = data.conversationId;

                //agregar conversación a los activos
                setActivePrivateChats((prev) => new Set([...prev, conversationId]));

                //cargar historial del chat privado
                loadPrivateHistory(conversationId);

                //recargar lista de conversaciones para actualizar orden
                loadConversations();

                return { success: true, conversationId, otherParticipant: data.otherParticipant };
            } else {
                const errorData = await res.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            console.error("[ChatContext] Error starting private chat:", error);
            return { success: false, error: error.message };
        }
    }, [loadPrivateHistory, loadConversations]);

    //enviar mensaje privado
    const sendPrivateMessage = useCallback((conversationId, text, recipientId) => {
        if (!socket || !connected || !text?.trim()) return;

        //preparar datos del remitente
        const sender = user
            ? {
                id: user._id || user.id,
                userName: user.userName,
                avatar: user.avatar,
            }
            : null;

        //enviar mensaje privado al servidor
        socket.emit(
            "chat:private:send",
            { text: text.trim(), conversationId, recipientId, user: sender },
            (res) => {
                if (!res?.ok) {
                    console.error("[ChatContext] Send private message error:", res?.error);
                } else {
                    //actualizar lista de conversaciones para actualizar orden
                    loadConversations();
                }
            }
        );
    }, [socket, connected, user, loadConversations]);

    //obtener conteo de usuarios en una sala
    const getRoomCount = useCallback((roomId) => {
        if (!socket || !connected) return;

        socket.emit("room:get-count", roomId, (res) => {
            if (res) {
                setRoomCounts((prev) => ({ ...prev, [res.room]: res.count }));
            }
        });
    }, [socket, connected]);

    //obtener mensajes de una sala (helper para componentes)
    const getRoomMessages = useCallback((roomId) => {
        return messages[roomId] || [];
    }, [messages]);

    //obtener mensajes de un chat privado (helper para componentes)
    const getPrivateMessages = useCallback((chatId) => {
        return privateMessages[chatId] || [];
    }, [privateMessages]);

    //verificar estado de conexión de un usuario
    const checkUserConnectionStatus = useCallback((userId) => {
        if (!socket || !connected || !userId) return false;

        //verificar en el estado local primero
        const status = userConnectionStatus.get(String(userId));
        if (status !== undefined) {
            return status;
        }

        //si no está en el estado local, consultar al servidor
        socket.emit("user:check_status", userId, (response) => {
            if (response) {
                setUserConnectionStatus((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(String(userId), response.isConnected);
                    return newMap;
                });
            }
        });

        return false; //retornar false por defecto mientras se consulta
    }, [socket, connected, userConnectionStatus]);

    //valor del contexto que se expone a los componentes
    const value = {
        //estado
        socket,
        connected,
        messages,
        privateMessages,
        activeRooms: Array.from(activeRooms),
        activePrivateChats: Array.from(activePrivateChats),
        roomCounts,
        conversations,
        userConnectionStatus,
        checkUserConnectionStatus,

        //acciones
        joinRoom,
        leaveRoom,
        sendRoomMessage,
        startPrivateChat,
        sendPrivateMessage,
        getRoomCount,
        loadRoomHistory,
        loadPrivateHistory,
        loadConversations,
        deleteConversation,
        getRoomMessages,
        getPrivateMessages,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

//custom hook para usar el contexto de chat en componentes
// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

