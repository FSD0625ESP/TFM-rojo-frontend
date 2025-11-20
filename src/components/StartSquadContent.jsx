import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { makeRequest } from "../services/apiService";
import { Loader2, MoreHorizontal, User, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { IMG_DEFAULT, IMG_ROLES } from "../constants/images";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROLE_COLORS } from "../constants/matches";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";

//función para convertir el rol del backend (Top, Jungle, etc.) al formato del frontend (top, jungle, etc.)
const normalizeRole = (role) => {
  if (!role) return "top";
  return role.toLowerCase();
};

export function StartSquadContent() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { startPrivateChat } = useChat();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [squads, setSquads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [squadDetails, setSquadDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        setIsLoading(true);
        setError(null);

        //obtener la región del usuario
        const userRegion = user?.lolProfile?.region || null;

        //construir query con búsqueda y región
        const params = new URLSearchParams();
        if (search) {
          params.append("search", search);
        }
        if (userRegion) {
          params.append("region", userRegion);
        }

        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await makeRequest(`squads${query}`);
        setSquads(data);
      } catch (err) {
        console.error("Error al obtener squads:", err);
        setError("Error al cargar los squads");
        setSquads([]);
      } finally {
        setIsLoading(false);
      }
    };

    //debounce para evitar demasiadas peticiones mientras se escribe
    const timeoutId = setTimeout(() => {
      fetchSquads();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, user?.lolProfile?.region]);

  //obtener detalles del squad cuando se abre el dialog
  useEffect(() => {
    const fetchSquadDetails = async () => {
      if (!selectedSquad) return;

      try {
        setIsLoadingDetails(true);
        const data = await makeRequest(`squads/${selectedSquad.id}`);
        setSquadDetails(data);
      } catch (err) {
        console.error("Error al obtener detalles del squad:", err);
        setSquadDetails(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchSquadDetails();
  }, [selectedSquad]);

  //escuchar actualizaciones de squads en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleSquadUpdate = (squadData) => {
      //actualizar la lista de squads
      setSquads((prevSquads) =>
        prevSquads.map((squad) =>
          squad.id === squadData.squadId
            ? {
              ...squad,
              name: squadData.name,
              description: squadData.description,
              membersCount: squadData.membersCount,
            }
            : squad
        )
      );

      //actualizar el selectedSquad si está abierto
      if (selectedSquad && selectedSquad.id === squadData.squadId) {
        setSelectedSquad((prev) => ({
          ...prev,
          name: squadData.name,
          description: squadData.description,
          membersCount: squadData.membersCount,
        }));
      }

      //actualizar el squadDetails si está cargado
      if (squadDetails && squadDetails.id === squadData.squadId) {
        setSquadDetails((prev) => ({
          ...prev,
          name: squadData.name,
          description: squadData.description,
          membersCount: squadData.membersCount,
        }));
      }
    };

    const handleSquadUpdated = (squadData) => {
      //cuando se actualiza la lista de miembros (squad:updated)
      //refrescar el squad completo si está en la lista o en el dialog
      if (selectedSquad && selectedSquad.id === squadData.squadId) {
        //recargar los detalles del squad
        const fetchSquadDetails = async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/squads/${squadData.squadId}`,
              { credentials: "include" }
            );
            if (response.ok) {
              const data = await response.json();
              setSquadDetails(data);
              setSelectedSquad((prev) => ({
                ...prev,
                membersCount: data.membersCount,
              }));
            }
          } catch (err) {
            console.error("Error al obtener detalles del squad:", err);
          }
        };
        fetchSquadDetails();
      }

      //actualizar la lista de squads con el nuevo membersCount
      setSquads((prevSquads) =>
        prevSquads.map((squad) =>
          squad.id === squadData.squadId
            ? {
              ...squad,
              membersCount: squadData.members?.length || squad.membersCount,
            }
            : squad
        )
      );
    };

    socket.on("squad:updated_info", handleSquadUpdate);
    socket.on("squad:updated", handleSquadUpdated);

    return () => {
      socket.off("squad:updated_info", handleSquadUpdate);
      socket.off("squad:updated", handleSquadUpdated);
    };
  }, [socket, selectedSquad, squadDetails]);

  const handleViewSquad = (squad) => {
    setSelectedSquad(squad);
    //unirse a la sala del squad para recibir actualizaciones en tiempo real
    if (socket && squad?.id) {
      socket.emit("join_squad_room", squad.id);
    }
  };

  const handleCloseDialog = () => {
    //salir de la sala del squad al cerrar el diálogo
    if (socket && selectedSquad?.id) {
      socket.emit("leave_squad_room", selectedSquad.id);
    }
    setSelectedSquad(null);
    setSquadDetails(null);
  };

  const handleViewProfile = (member) => {
    // Obtener los datos del miembro para mostrar en el perfil
    const memberData = {
      userId: member.userId?._id || member.userId?.id || member.userId,
      userName: member.userName || member.userId?.userName || "Unknown",
      avatar: member.avatar || member.userId?.avatar || IMG_DEFAULT.avatar.src,
      lolStats: member.userId?.lolStats || {},
      lolProfile: member.userId?.lolProfile || {},
    };

    setSelectedMember(memberData);
    setIsProfileDialogOpen(true);
  };

  const handleStartChat = async () => {
    if (!selectedMember?.userId) {
      toast.error("No se puede iniciar el chat: usuario no encontrado");
      return;
    }

    // Verificar que no sea el mismo usuario
    const currentUserId = user?._id || user?.id;
    if (selectedMember.userId === currentUserId) {
      toast.error("No puedes chatear contigo mismo");
      return;
    }

    try {
      const result = await startPrivateChat(selectedMember.userId);

      if (result.success) {
        toast.success(`Chat iniciado con ${selectedMember.userName}`);
        setIsProfileDialogOpen(false);
        // Navegar a community con el chat abierto
        navigate(`/start/community?tab=chats&conversation=${result.conversationId}`);
      } else {
        toast.error(result.error || "Error al iniciar el chat");
      }
    } catch (error) {
      console.error("Error al iniciar chat:", error);
      toast.error("Error al iniciar el chat");
    }
  };

  const renderMemberCard = (member, index) => {
    //normalizar el rol para usar en IMG_ROLES y ROLE_COLORS
    const normalizedRole = normalizeRole(member.role);
    const roleIcon = IMG_ROLES[normalizedRole] || {
      src: IMG_DEFAULT.profileIcon.src,
      alt: "default-role",
    };

    const borderColor = ROLE_COLORS[normalizedRole] || "border-gray-600";

    //obtener rank y tier del miembro
    const ranks = member.userId?.lolProfile?.ranks;
    const tier = member.userId?.lolProfile?.tier;
    const tierDisplay = ranks && tier ? `${ranks} ${tier}` : "Unranked";
    const honor = member.userId?.lolProfile?.honor || "Honor 3";

    return (
      <Card
        key={index}
        className={`shadow-md overflow-hidden border-4 ${borderColor} bg-neutral-900 text-white hover:bg-neutral-800 relative`}
      >
        <CardHeader className="flex flex-wrap items-start gap-4 px-4">
          <img
            src={member.avatar || member.userId?.avatar || IMG_DEFAULT.avatar.src}
            alt="avatar"
            className="w-14 h-14 rounded-full border-2 border-white object-cover flex-shrink-0"
            draggable={false}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = IMG_DEFAULT.avatar.src;
            }}
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">
              {member.userName || member.userId?.userName || "Unknown"}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary">{tierDisplay}</Badge>
              <Badge variant="outline">{honor}</Badge>
            </div>
          </div>
          <img
            src={roleIcon.src}
            alt={roleIcon.alt}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
        </CardHeader>
        <div className="absolute bottom-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-neutral-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4 mb-6 bg-muted rounded-xl p-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold px-2">Search </h2>
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-2 border-muted-foreground"
          variant="outlined"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : squads.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-muted-foreground">
                Not found squads
              </p>
              <p className="text-sm text-muted-foreground">
                Try again with a different search
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {squads.map((squad) => (
            <Card key={squad.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{squad.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {squad.description || "No description"}
                </p>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-sm">
                  <p>Members: {squad.membersCount}/5</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Roles: {squad.members.map((m) => m.role).join(", ")}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleViewSquad(squad)}>
                  View Squad
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para mostrar los miembros del squad */}
      <Dialog open={!!selectedSquad} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] sm:max-w-3xl overflow-y-auto" aria-describedby="squad-dialog-description">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-primary uppercase">
              {selectedSquad?.name || "Squad Details"}
            </DialogTitle>
            <DialogDescription id="squad-dialog-description" className="text-md text-muted-foreground px-4 sm:px-0">
              {selectedSquad?.description || "No description"}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : squadDetails && squadDetails.members?.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Members: {squadDetails.membersCount}/5
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {squadDetails.members.map((member, index) =>
                  renderMemberCard(member, index)
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-muted-foreground">
                    Cannot load squad members
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try again later
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para mostrar el perfil del usuario */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="profile-dialog-description">
          <DialogHeader>
            <DialogTitle>Player Profile</DialogTitle>
            <DialogDescription id="profile-dialog-description">
              Player statistics and information
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="py-4 space-y-4">
              {/* Información del usuario */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <img
                  src={selectedMember.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = IMG_DEFAULT.avatar.src;
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedMember.userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMember.lolProfile?.ranks && selectedMember.lolProfile?.tier
                      ? `${selectedMember.lolProfile.ranks} ${selectedMember.lolProfile.tier}`
                      : "Unranked"}
                  </p>
                </div>
                {selectedMember.userId && (selectedMember.userId !== (user?._id || user?.id)) && (
                  <Button
                    onClick={handleStartChat}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Button>
                )}
              </div>

              {/* Estadísticas */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>
                    Player performance and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="champion">Champion</Label>
                      <Input
                        className="bg-muted"
                        id="champion"
                        value={selectedMember.lolStats?.champion || ""}
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="winRate">Win Rate</Label>
                      <Input
                        className="bg-muted"
                        id="winRate"
                        value={selectedMember.lolStats?.winRate || ""}
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matchesPlayed">Matches Played</Label>
                      <Input
                        className="bg-muted"
                        id="matchesPlayed"
                        value={selectedMember.lolStats?.matchesPlayed || ""}
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kills">Kills</Label>
                      <Input
                        id="kills"
                        value={selectedMember.lolStats?.kills || ""}
                        className="bg-muted"
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deaths">Deaths</Label>
                      <Input
                        className="bg-muted"
                        id="deaths"
                        value={selectedMember.lolStats?.deaths || ""}
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assists">Assists</Label>
                      <Input
                        className="bg-muted"
                        id="assists"
                        value={selectedMember.lolStats?.assists || ""}
                        readOnly
                        placeholder="N/A"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="queue">Queue</Label>
                    <Input
                      className="bg-muted"
                      id="queue"
                      value={selectedMember.lolProfile?.queue || ""}
                      readOnly
                      placeholder="N/A"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
