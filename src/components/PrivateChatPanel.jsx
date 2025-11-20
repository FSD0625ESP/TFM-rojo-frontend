import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { IMG_DEFAULT } from "../constants/images";

//componente para mostrar chat privado entre dos usuarios
export function PrivateChatPanel({ conversationId, className = "", onLeave }) {
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const {
        connected,
        sendPrivateMessage,
        getPrivateMessages,
        loadPrivateHistory,
        conversations,
        userConnectionStatus,
        checkUserConnectionStatus,
    } = useChat();

    //obtener mensajes de la conversación desde el contexto
    const messages = getPrivateMessages(conversationId);

    //obtener información del otro participante
    const conversation = conversations.find(c => c.conversationId === conversationId);
    const otherParticipant = conversation?.otherParticipant;

    //obtener estado de conexión del otro participante
    const otherParticipantConnected = otherParticipant
        ? (userConnectionStatus.get(String(otherParticipant.id)) ?? false)
        : false;

    //cargar historial cuando se monta el componente o cambia la conversación
    useEffect(() => {
        if (conversationId) {
            loadPrivateHistory(conversationId);
        }
    }, [conversationId, loadPrivateHistory]);

    //consultar estado de conexión del otro participante cuando se monta o cambia
    useEffect(() => {
        if (otherParticipant?.id && connected) {
            checkUserConnectionStatus(otherParticipant.id);
        }
    }, [otherParticipant?.id, connected, checkUserConnectionStatus]);

    //auto-scroll al último mensaje cuando hay nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //enviar un mensaje privado
    const send = () => {
        if (!text.trim()) return;
        sendPrivateMessage(conversationId, text);
        setText("");
    };

    //salir del chat
    const handleLeave = () => {
        if (onLeave) {
            onLeave();
        }
    };

    return (
        <div className={`flex flex-col h-full border rounded p-2 ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {otherParticipant && (
                        <>
                            <img
                                src={otherParticipant.avatar || IMG_DEFAULT.avatarGuest.src}
                                alt={otherParticipant.userName}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="font-semibold">{otherParticipant.userName}</div>
                        </>
                    )}
                    {/* indicador de estado de conexión del otro participante */}
                    {otherParticipantConnected ? (
                        <span className="text-xs text-green-500" title="Online">● Online</span>
                    ) : (
                        <span className="text-xs text-gray-500" title="Offline">● Offline</span>
                    )}
                </div>
                <button
                    onClick={handleLeave}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                    Close
                </button>
            </div>
            {/* mensajes del chat */}
            <div className="flex-1 overflow-auto space-y-2 bg-white text-black p-2 rounded border">
                {messages.length > 0 ? (
                    messages.map((m, i) => {
                        const isOwnMessage = m.sender === (user?._id || user?.id);
                        const isSystemMessage = m.isSystemMessage || false;

                        //mensaje del sistema: centrado y en gris
                        if (isSystemMessage) {
                            return (
                                <div
                                    key={`${m.id || m._id || "noid"}-${m.createdAt || i}`}
                                    className="text-sm flex justify-center items-center my-2"
                                >
                                    <div className="inline-block px-3 py-1.5 rounded bg-gray-300 text-gray-700 text-xs italic max-w-[80%] text-center">
                                        {m.text}
                                    </div>
                                </div>
                            );
                        }

                        //mensaje normal
                        return (
                            <div
                                key={`${m.id || m._id || "noid"}-${m.createdAt || i}`}
                                className={`text-sm flex items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                            >
                                <img
                                    src={m.senderAvatar || IMG_DEFAULT.avatarGuest.src}
                                    alt={m.senderName || "user"}
                                    className="w-8 h-8 rounded-full object-cover mt-0.5"
                                />
                                <div className={`flex-1 ${isOwnMessage ? "text-right" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        {!isOwnMessage && (
                                            <span className="font-medium">{m.senderName || "LOL Match"}</span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {new Date(m.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className={`inline-block p-2 rounded ${isOwnMessage
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-black"
                                        }`}>
                                        {m.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                        No messages yet. Start the conversation!
                    </div>
                )}
                {/* referencia para auto-scroll */}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-2 flex gap-2">
                <input
                    className="flex-1 border rounded px-2 py-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
                    placeholder="Write a message..."
                    //deshabilitar input si no hay conexión propia
                    disabled={!connected}
                />
                <button
                    className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                    onClick={send}
                    //deshabilitar botón si no hay conexión propia
                    disabled={!connected}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

