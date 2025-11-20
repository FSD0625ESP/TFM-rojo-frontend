import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

//obtener la URL base de la API y del socket
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";
const SOCKET_BASE = API_BASE.replace(/\/api$/, "");

//provider para manejar una única conexión de socket compartida
export function SocketProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);

    //inicializar conexión socket cuando el usuario esté autenticado
    useEffect(() => {
        if (!isAuthenticated || !user) {
            //limpiar conexión si el usuario no está autenticado
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        //crear nueva conexión socket.io (solo una vez)
        const newSocket = io(SOCKET_BASE, {
            path: "/socket.io",
            transports: ["websocket", "polling"],
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        //manejar evento de conexión exitosa
        newSocket.on("connect", () => {
            setConnected(true);
        });

        //manejar evento de desconexión
        newSocket.on("disconnect", () => {
            setConnected(false);
        });

        //manejar errores de conexión
        newSocket.on("connect_error", (error) => {
            console.error("[SocketContext] Connection error:", error);
            setConnected(false);
        });

        //manejar reconexión
        newSocket.on("reconnect", () => {
            setConnected(true);
        });

        //limpiar conexión al desmontar o cambiar de usuario
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
            socketRef.current = null;
            setSocket(null);
            setConnected(false);
        };
    }, [isAuthenticated, user]);

    const value = {
        socket,
        connected,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

//custom hook para usar el contexto de socket en componentes
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

