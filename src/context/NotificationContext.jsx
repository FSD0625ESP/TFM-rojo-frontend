import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import { toast } from "sonner";

const NotificationContext = createContext();

//obtener la URL base de la API
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

//provider para envolver la aplicación y centralizar toda la lógica de notificaciones
export function NotificationProvider({ children }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const refreshUserRef = useRef(refreshUser);
  const joinedRoomRef = useRef(false);
  const currentUserIdRef = useRef(null);

  //actualizar la referencia de refreshUser
  useEffect(() => {
    refreshUserRef.current = refreshUser;
  }, [refreshUser]);

  //cargar notificaciones desde el servidor
  const fetchNotifications = useCallback(async () => {
    try {
      const url = API_BASE.endsWith("/api")
        ? `${API_BASE}/auth/squad-notifications`
        : `${API_BASE}/api/auth/squad-notifications`;

      const res = await fetch(url, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const fetchedNotifications = data.notifications || [];
        setNotifications(fetchedNotifications);
        //calcular el número de notificaciones pendientes
        const pendingCount = fetchedNotifications.filter((n) => n.status === "pending").length;
        setUnreadCount(pendingCount);
      }
    } catch (err) {
      //manejar errores silenciosamente
    }
  }, []);

  //configurar los listeners del socket cuando el usuario está autenticado y el socket está disponible
  useEffect(() => {
    //el usuario puede tener _id o id
    const userId = user?._id || user?.id;

    //sólo continuar si el usuario está autenticado, tiene ID y el socket está disponible
    if (!isAuthenticated || !userId || !socket) {
      joinedRoomRef.current = false;
      currentUserIdRef.current = null;
      return;
    }

    const userIdString = userId.toString();
    currentUserIdRef.current = userIdString;

    //función para unir al usuario a la sala
    const joinUserRoom = () => {
      if (!connected) {
        return;
      }
      if (joinedRoomRef.current) {
        return;
      }

      socket.emit("join_user_room", userIdString, (response) => {
        if (response?.success) {
          joinedRoomRef.current = true;
        } else {
          joinedRoomRef.current = false;
          //reintentar después de 1 segundo
          setTimeout(() => {
            if (connected) {
              joinUserRoom();
            }
          }, 1000);
        }
      });
    };

    //cuando el socket se conecta, unir al usuario a la sala inmediatamente
    if (connected) {
      setTimeout(() => {
        joinUserRoom();
      }, 100);
    }

    //escuchar el evento de conexión para unir al usuario a la sala
    const handleConnect = () => {
      setTimeout(() => {
        joinUserRoom();
      }, 100);
    };

    //escuchar el evento de reconexión para unir al usuario a la sala nuevamente
    const handleReconnect = () => {
      joinedRoomRef.current = false;
      setTimeout(() => {
        joinUserRoom();
      }, 100);
    };

    //manejar la desconexión
    const handleDisconnect = () => {
      joinedRoomRef.current = false;
    };

    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);
    socket.on("disconnect", handleDisconnect);

    //escuchar las nuevas notificaciones de equipo en tiempo real
    socket.on("squad:new_notification", (notificationData) => {
      setNotifications((prev) => {
        //evitar duplicados
        const exists = prev.some((n) => n._id?.toString() === notificationData._id?.toString());
        if (exists) {
          return prev;
        }

        //añadir la nueva notificación al principio
        const updated = [notificationData, ...prev];

        //calcular el número de notificaciones pendientes
        const pendingCount = updated.filter((n) => n.status === "pending").length;
        setUnreadCount(pendingCount);

        return updated;
      });

      //mostrar la notificación en un toast
      toast.info("New squad request received", {
        duration: 5000,
      });
    });

    //escuchar cuando una solicitud es aceptada
    socket.on("squad:accepted", (notificationData) => {
      setNotifications((prev) => {
        //evitar duplicados
        const exists = prev.some((n) => n._id?.toString() === notificationData._id?.toString());
        if (exists) {
          return prev;
        }

        const updated = [notificationData, ...prev];
        //calcular el número de notificaciones pendientes (las notificaciones aceptadas no son pendientes)
        const pendingCount = updated.filter((n) => n.status === "pending").length;
        setUnreadCount(pendingCount);
        return updated;
      });

      //no mostrar toast aquí para evitar duplicados, se mostrará cuando se acepte la invitación

      //actualizar las notificaciones y los datos del usuario
      fetchNotifications();
      if (refreshUserRef.current) {
        refreshUserRef.current();
      }
    });

    //escuchar cuando una solicitud es rechazada
    socket.on("squad:rejected", (notificationData) => {
      setNotifications((prev) => {
        //avoid duplicates
        const exists = prev.some((n) => n._id?.toString() === notificationData._id?.toString());
        if (exists) {
          return prev;
        }

        const updated = [notificationData, ...prev];
        const pendingCount = updated.filter((n) => n.status === "pending").length;
        setUnreadCount(pendingCount);
        return updated;
      });

      toast.warning(`Squad request rejected by ${notificationData.fromUserId?.userName || "User"}`, {
        duration: 5000,
      });

      //actualizar las notificaciones
      fetchNotifications();
    });

    //escuchar cuando se actualiza un squad (usuarios agregados en tiempo real)
    socket.on("squad:updated", (squadData) => {
      //actualizar los datos del usuario para reflejar los cambios en el squad
      if (refreshUserRef.current) {
        refreshUserRef.current();
      }
      
      //no mostrar toast aquí para evitar duplicados
    });

    //escuchar cuando se actualizan las notificaciones (cuando se eliminan notificaciones relacionadas)
    socket.on("squad:notifications_updated", () => {
      //refrescar las notificaciones desde el servidor
      fetchNotifications();
    });

    //comprobación periódica para asegurar que el socket se una a la sala
    //esto es necesario porque a veces el evento 'connect' no se dispara correctamente
    const checkInterval = setInterval(() => {
      if (connected && !joinedRoomRef.current && currentUserIdRef.current) {
        joinUserRoom();
      }
    }, 2000); //comprobar cada 2 segundos

    //limpiar cuando se desmonta o cambia el usuario/socket
    return () => {
      clearInterval(checkInterval);
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("squad:new_notification");
      socket.off("squad:accepted");
      socket.off("squad:rejected");
      socket.off("squad:updated");
      socket.off("squad:notifications_updated");
      joinedRoomRef.current = false;
    };
  }, [isAuthenticated, user, socket, connected, fetchNotifications]);

  //cargar las notificaciones cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  //enviar invitación de equipo
  const sendSquadInvitation = async (userId) => {
    try {
      const url = API_BASE.endsWith("/api")
        ? `${API_BASE}/auth/send-squad-invitation`
        : `${API_BASE}/api/auth/send-squad-invitation`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Invitation sent successfully");
        return { success: true };
      } else {
        toast.error(data.message || "Error sending invitation");
        return { success: false, message: data.message };
      }
    } catch (err) {
      toast.error("Error sending invitation");
      return { success: false, message: err.message };
    }
  };

  //aceptar invitación de equipo
  const acceptInvitation = async (notificationId) => {
    try {
      const url = API_BASE.endsWith("/api")
        ? `${API_BASE}/auth/accept-squad-invitation`
        : `${API_BASE}/api/auth/accept-squad-invitation`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      });

      const data = await res.json();
      if (res.ok) {
        //mostrar mensaje de éxito
        toast.success(data.message || "Squad invitation accepted successfully");

        //actualizar el estado local inmediatamente
        setNotifications((prev) => {
          const updated = prev.map((n) =>
            n._id === notificationId ? { ...n, status: "accepted" } : n
          );
          const pendingCount = updated.filter((n) => n.status === "pending").length;
          setUnreadCount(pendingCount);
          return updated;
        });

        //actualizar desde el servidor para obtener los datos actualizados
        fetchNotifications();
        //actualizar los datos del usuario para actualizar el equipo
        if (refreshUserRef.current) {
          await refreshUserRef.current();
        }
        return { success: true, message: data.message };
      } else {
        //mostrar mensaje de error desde el servidor
        toast.error(data.message || "Cannot accept invitation. Please check if the role is already occupied in your squad");
        return { success: false, message: data.message };
      }
    } catch (err) {
      toast.error("Error accepting invitation. Please try again");
      return { success: false, message: err.message };
    }
  };

  //rechazar invitación de equipo
  const rejectInvitation = async (notificationId) => {
    try {
      const url = API_BASE.endsWith("/api")
        ? `${API_BASE}/auth/reject-squad-invitation`
        : `${API_BASE}/api/auth/reject-squad-invitation`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.info(data.message || "Invitation rejected");

        //actualizar el estado local inmediatamente
        setNotifications((prev) => {
          const updated = prev.filter((n) => n._id !== notificationId);
          const pendingCount = updated.filter((n) => n.status === "pending").length;
          setUnreadCount(pendingCount);
          return updated;
        });

        //actualizar desde el servidor
        fetchNotifications();
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (err) {
      toast.error("Error rejecting invitation");
      return { success: false };
    }
  };

  //eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      const url = API_BASE.endsWith("/api")
        ? `${API_BASE}/auth/squad-notifications`
        : `${API_BASE}/api/auth/squad-notifications`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      });

      const data = await res.json();
      if (res.ok) {
        //actualizar el estado local inmediatamente
        setNotifications((prev) => {
          const updated = prev.filter((n) => n._id !== notificationId);
          const pendingCount = updated.filter((n) => n.status === "pending").length;
          setUnreadCount(pendingCount);
          return updated;
        });

        //actualizar desde el servidor
        fetchNotifications();
        
        //actualizar los datos del usuario para reflejar cambios en el squad
        if (refreshUserRef.current) {
          await refreshUserRef.current();
        }
        
        return { success: true };
      } else {
        toast.error(data.message || "Error deleting notification");
        return { success: false };
      }
    } catch (err) {
      toast.error("Error deleting notification");
      return { success: false };
    }
  };

  //valor del contexto que se expone a los componentes
  const value = {
    notifications,
    unreadCount,
    socket,
    fetchNotifications,
    sendSquadInvitation,
    acceptInvitation,
    rejectInvitation,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

//custom hook para usar el contexto de notificaciones en componentes
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
