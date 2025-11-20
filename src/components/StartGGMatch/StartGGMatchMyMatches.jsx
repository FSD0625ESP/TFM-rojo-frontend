import { useState } from "react";
import { Swords, MessageCircle, UserPlus, Search, Users, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { ROLE_COLORS } from "../../constants/matches";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function StartGGMatchMyMatches({ matches, setMatches }) {
  const { user, refreshUser } = useAuth();
  const { sendSquadInvitation } = useNotifications();
  const { startPrivateChat } = useChat();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendingInvitation, setSendingInvitation] = useState(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRoleErrorDialog, setShowRoleErrorDialog] = useState(false);
  const [roleErrorMessages, setRoleErrorMessages] = useState([]);
  const [showSquadConfirmDialog, setShowSquadConfirmDialog] = useState(false);
  const [matchToInvite, setMatchToInvite] = useState(null);

  // Filtrar duplicados por id, manteniendo solo la primera ocurrencia
  const uniqueMatches = matches.filter((match, index, self) =>
    index === self.findIndex((m) => m.id === match.id)
  );

  //manejar la eliminación de un match
  const handleRemoveMatch = (match) => {
    setMatchToDelete(match);
    setShowDeleteDialog(true);
  };

  //función helper para convertir rol de minúsculas a formato del schema (Top, Jungle, etc.)
  const normalizeRole = (role) => {
    if (!role) return null;
    const roleLower = role.toLowerCase();
    if (roleLower === "adc") return "ADC";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  //manejar click en botón Squad - abrir diálogo de confirmación
  const handleSquadClick = (match) => {
    setMatchToInvite(match);
    setShowSquadConfirmDialog(true);
  };

  //confirmar y enviar solicitud de squad
  const confirmSquadInvitation = async () => {
    if (!matchToInvite) return;

    //verificar si el usuario tiene un rol configurado
    if (!user?.lolProfile?.roleLol) {
      setShowSquadConfirmDialog(false);
      setShowRoleDialog(true);
      setMatchToInvite(null);
      return;
    }

    //validaciones de rol antes de enviar
    const currentUserRole = user?.lolProfile?.roleLol;
    const currentUserSquad = user?.lolProfile?.mySquad || [];
    const targetUserRole = matchToInvite.role;
    const normalizedTargetRole = normalizeRole(targetUserRole);
    const errors = [];

    //validar si el usuario actual tiene el mismo rol que el objetivo
    if (currentUserRole === normalizedTargetRole) {
      errors.push("You have the same role as this user. You cannot send a squad invitation to someone with the same role.");
    }

    //validar si el usuario ya tiene alguien en su squad con el rol del objetivo
    const hasRoleInSquad = currentUserSquad.some(
      (member) => member.role === normalizedTargetRole
    );
    if (hasRoleInSquad) {
      errors.push(`You already have a ${normalizedTargetRole} in your squad. Each role can only be assigned once.`);
    }

    //si hay errores, mostrar el diálogo y no enviar la solicitud
    if (errors.length > 0) {
      setShowSquadConfirmDialog(false);
      setRoleErrorMessages(errors);
      setShowRoleErrorDialog(true);
      setMatchToInvite(null);
      return;
    }

    setSendingInvitation(matchToInvite.id);
    setShowSquadConfirmDialog(false);
    try {
      const result = await sendSquadInvitation(matchToInvite.id);
      if (result.success) {
        //la notificación ya se muestra desde el contexto
      } else {
        //manejar errores del backend relacionados con roles
        const errorMessage = result.message || "";
        if (
          errorMessage.includes("rol") ||
          errorMessage.includes("role") ||
          errorMessage.includes("ocupado") ||
          errorMessage.includes("already") ||
          errorMessage.includes("same role")
        ) {
          setRoleErrorMessages([errorMessage]);
          setShowRoleErrorDialog(true);
        }
      }
    } catch (error) {
      console.error("Error sending squad invitation:", error);
    } finally {
      setSendingInvitation(null);
      setMatchToInvite(null);
    }
  };

  //redirigir a la página de configuración para configurar el rol
  const handleGoToSettings = () => {
    setShowRoleDialog(false);
    navigate("/profile/my-settings");
  };

  //manejar clic en botón Chat
  const handleChatClick = async (match) => {
    try {
      const result = await startPrivateChat(match.id);
      if (result.success) {
        //navegar a la página de community con la tab de chats abierta
        navigate("/start/community?tab=chats&conversation=" + result.conversationId);
      } else {
        console.error("Error starting chat:", result.error);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  //confirmar eliminación
  const confirmDelete = async () => {
    if (!matchToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/remove-match`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: matchToDelete.id }),
      });

      if (response.ok) {
        const data = await response.json();
        //actualizar matches con los datos del servidor
        if (data.user?.matches) {
          setMatches(data.user.matches);
        }
        //actualizar el contexto de autenticación para mantener sincronizado
        if (refreshUser) {
          await refreshUser();
        }
        setShowDeleteDialog(false);
        setMatchToDelete(null);
      } else {
        const errorData = await response.json();
        console.error("Error removing match:", errorData.message);
        //refrescar desde el servidor para mantener sincronización
        if (refreshUser) {
          const refreshed = await refreshUser();
          if (refreshed?.user?.matches) {
            setMatches(refreshed.user.matches);
          }
        }
        setShowDeleteDialog(false);
        setMatchToDelete(null);
      }
    } catch (error) {
      console.error("Error removing match:", error);
      //refrescar desde el servidor para mantener sincronización
      if (refreshUser) {
        const refreshed = await refreshUser();
        if (refreshed?.user?.matches) {
          setMatches(refreshed.user.matches);
        }
      }
      setShowDeleteDialog(false);
      setMatchToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {uniqueMatches.length > 0 ? (
        <div className="space-y-3">
          <Card className="p-0 bg-background border-none gap-2 sm:p-4 sm:bg-card sm:border">
            <CardHeader className="p-0 sm:px-4 sm:pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted"
                />
              </div>
            </CardHeader>
            {/* Listado de los matches */}
            <CardContent className="p-0 sm:px-4">
              <div className="space-y-4">
                {uniqueMatches
                  .filter((match) =>
                    match.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .slice()
                  .reverse() //mostrar los matches más recientes primero
                  .map((match, i) => {
                    const matchRoleColor = ROLE_COLORS[match.role] || "border-gray-500";
                    return (
                      <Card
                        key={i}
                        className={`bg-neutral-800 border-4 ${matchRoleColor} overflow-hidden p-0`}
                      >
                        {/* Card Content de Matches */}
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex gap-4">
                              {/* Avatar - arriba solo en móvil, a la izquierda en desktop */}
                              <div className="flex justify-start sm:justify-center">
                                <img
                                  src={match.avatar}
                                  alt={match.name}
                                  draggable={false}
                                  className="w-20 h-20 rounded-full border-4 border-white object-cover flex-shrink-0"
                                />
                              </div>

                              {/* Contenido - abajo del avatar en móvil, en el centro en desktop */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white truncate text-center sm:text-left uppercase">
                                  {match.name}
                                </h3>
                                <div className="flex rows-2 sm:flex-row gap-2 mt-1 flex-wrap justify-center sm:justify-start">
                                  <Badge variant="secondary">{match.tier}</Badge>
                                  <Badge variant="outline">{match.honor}</Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                                  <span className="text-sm text-muted-foreground">
                                    {match.role.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Botones - a la derecha en ambos casos */}
                            <div className="flex flex-row sm:flex-col gap-1 sm:gap-2 flex-shrink-0 justify-between sm:justify-start">
                              <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => handleChatClick(match)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Chat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => handleSquadClick(match)}
                                disabled={sendingInvitation === match.id}
                              >
                                <Users className="w-4 h-4 mr-1" />
                                {sendingInvitation === match.id ? "Enviando..." : "Squad"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="whitespace-nowrap"
                                onClick={() => handleRemoveMatch(match)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <Swords className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No matches yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Start swiping on Summoners to find your perfect match!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmación para enviar solicitud de squad */}
      <Dialog open={showSquadConfirmDialog} onOpenChange={setShowSquadConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Send Squad Invitation</DialogTitle>
            <DialogDescription className="text-lg mt-4">
              Are you sure you want to send a squad invitation to{" "}
              <strong>{matchToInvite?.name}</strong>?
              <br />
              <br />
              This will send a notification to the user. They can accept or decline your invitation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSquadConfirmDialog(false);
                setMatchToInvite(null);
              }}
              disabled={sendingInvitation === matchToInvite?.id}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmSquadInvitation}
              disabled={sendingInvitation === matchToInvite?.id}
            >
              {sendingInvitation === matchToInvite?.id ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar match */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">⚠️ Remove Match</DialogTitle>
            <DialogDescription className="text-lg mt-4">
              Are you sure you want to remove <strong>{matchToDelete?.name}</strong> from your matches?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setMatchToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para indicar que debe configurar el rol */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <DialogTitle className="text-2xl">Role not configured</DialogTitle>
            <DialogDescription className="text-lg mt-4">
              To be able to send squad requests and make matches, you need to configure your League of Legends role.
              <br />
              <br />
              Please go to <strong>Profile → My Settings</strong> and configure your role before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={handleGoToSettings}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Go to my settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar errores de rol */}
      <Dialog open={showRoleErrorDialog} onOpenChange={setShowRoleErrorDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <DialogTitle className="text-2xl">Cannot send squad invitation</DialogTitle>
            <div className="text-muted-foreground text-lg mt-4 space-y-2">
              {roleErrorMessages.map((message, index) => (
                <div key={index} className="text-left">
                  {message}
                </div>
              ))}
            </div>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => setShowRoleErrorDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

