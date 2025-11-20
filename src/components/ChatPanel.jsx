import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { mockMessages } from "../mocks/chats";
import { IMG_DEFAULT } from "../constants/images";
import { useAuth } from "../context/AuthContext";

//usado en StartCommunityContent.jsx
export function ChatPanel({ room = "community", className = "", onLeave }) {
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    //obtener funciones y estado del contexto de chat
    const {
        connected,
        joinRoom,
        leaveRoom,
        sendRoomMessage,
        getRoomMessages,
        loadRoomHistory,
    } = useChat();

    //obtener mensajes de la sala desde el contexto
    const messages = getRoomMessages(room);

    //si no hay mensajes del contexto, usar mocks como fallback visual
    const displayMessages = messages.length > 0 ? messages : (mockMessages[room] || []);

    //unirse a la sala cuando el componente se monta o cambia la sala
    useEffect(() => {
        if (room) {
            joinRoom(room);
            loadRoomHistory(room);
        }

        return () => {
            if (room) {
                leaveRoom(room);
            }
        };
    }, [room, joinRoom, leaveRoom, loadRoomHistory]);

    //auto-scroll al último mensaje cuando hay nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //enviar un mensaje a la sala de chat
    const send = () => {
        if (!text.trim()) return;
        sendRoomMessage(room, text);
        setText("");
    };

    //salir de la sala
    const handleLeave = () => {
        leaveRoom(room);
        if (onLeave) {
            onLeave();
        }
    };

    return (
        <div className={`flex flex-col h-full border rounded p-2 ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="font-semibold">{user?.userName || "Chat "}</div>
                    {/* indicador de estado de conexión */}
                    {connected ? (
                        <span className="text-xs text-green-500">● Connected</span>
                    ) : (
                        <span className="text-xs text-red-500">● Disconnected</span>
                    )}
                </div>
                <button
                    onClick={handleLeave}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                    Leave Room
                </button>
            </div>
            {/* mensajes del chat */}
            <div className="flex-1 overflow-auto space-y-2 bg-white text-black p-2 rounded border">
                {displayMessages.map((m, i) => (
                    <div
                        key={`${m.id || m._id || "noid"}-${m.createdAt || i}`}
                        className="text-sm flex items-start gap-2"
                    >
                        <img
                            src={m.avatar || IMG_DEFAULT.avatarGuest.src}
                            alt={m.userName || "user"}
                            className="w-8 h-8 rounded-full object-cover mt-0.5"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{m.userName || "LOL Match"}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(m.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div>{m.text}</div>
                        </div>
                    </div>
                ))}
                {/* referencia para auto-scroll */}
                <div ref={messagesEndRef} />
                {displayMessages.length === 0 && (
                    <div className="text-sm text-gray-500">Waiting for messages...</div>
                )}
            </div>
            <div className="mt-2 flex gap-2">
                <input
                    className="flex-1 border rounded px-2 py-1"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
                    placeholder="Write a message..."
                    //deshabilitar input si no hay conexión
                    disabled={!connected}
                />
                <button
                    className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                    onClick={send}
                    //deshabilitar botón si no hay conexión
                    disabled={!connected}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
