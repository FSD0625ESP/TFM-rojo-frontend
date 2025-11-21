import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IMG_DEFAULT, IMG_ROLES } from "../constants/images.js";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { makeRequest } from "../services/apiService";
import { Loader2 } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { toast } from "sonner";
import { updateSquadSchema } from "../schemas/userSchemas";
import { ROLE_COLORS } from "../constants/matches";

//función para convertir el rol del backend (Top, Jungle, etc.) al formato del frontend (top, jungle, etc.)
const normalizeRole = (role) => {
  if (!role) return "top";
  return role.toLowerCase();
};

export function ProfileSquadContent() {
  const { user, refreshUser } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [userSquad, setUserSquad] = useState(null);
  const [isLoadingSquad, setIsLoadingSquad] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateSquadSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  //obtener el squad del usuario
  useEffect(() => {
    const fetchUserSquad = async () => {
      try {
        setIsLoadingSquad(true);
        const data = await makeRequest("squads/my-squad");
        setUserSquad(data);
        if (data) {
          form.reset({
            name: data.name || "",
            description: data.description || "",
          });
        }
      } catch (err) {
        console.error("Error al obtener squad del usuario:", err);
        setUserSquad(null);
      } finally {
        setIsLoadingSquad(false);
      }
    };

    fetchUserSquad();
  }, [user, form]);

  //escuchar actualizaciones del squad en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleSquadUpdate = (squadData) => {
      //actualizar el squad local si es el mismo squad
      if (userSquad && squadData.squadId === userSquad.id) {
        setUserSquad((prev) => ({
          ...prev,
          name: squadData.name || prev.name,
          description: squadData.description || prev.description,
          members: squadData.members || prev.members,
          membersCount: squadData.membersCount || prev.membersCount,
        }));
      }
      //refrescar el usuario para actualizar mySquad
      refreshUser();
    };

    const handleSquadUpdated = (squadData) => {
      //cuando se actualiza la lista de miembros (squad:updated)
      if (userSquad && squadData.squadId === userSquad.id) {
        //refrescar el squad completo
        const fetchUserSquad = async () => {
          try {
            const data = await makeRequest("squads/my-squad");
            setUserSquad(data);
            if (data) {
              form.reset({
                name: data.name || "",
                description: data.description || "",
              });
            }
          } catch (err) {
            console.error("Error al obtener squad del usuario:", err);
          }
        };
        fetchUserSquad();
      }
      //refrescar el usuario para actualizar mySquad
      refreshUser();
    };

    socket.on("squad:updated_info", handleSquadUpdate);
    socket.on("squad:updated", handleSquadUpdated);
    socket.on("squad:left", () => {
      setUserSquad(null);
      refreshUser();
    });
    socket.on("squad:deleted", (data) => {
      if (userSquad && data.squadId === userSquad.id) {
        setUserSquad(null);
        refreshUser();
      }
    });

    return () => {
      socket.off("squad:updated_info", handleSquadUpdate);
      socket.off("squad:updated", handleSquadUpdated);
      socket.off("squad:left");
      socket.off("squad:deleted");
    };
  }, [socket, userSquad, refreshUser, form]);

  const handleOpenEditDialog = () => {
    if (userSquad) {
      form.reset({
        name: userSquad.name || "",
        description: userSquad.description || "",
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveSquad = async (values) => {
    if (!userSquad) return;

    try {
      setIsSaving(true);
      const data = await makeRequest(`squads/${userSquad.id}`, "PATCH", {
        name: values.name.trim(),
        description: values.description?.trim() || "",
      });

      setUserSquad(data);
      setIsEditDialogOpen(false);
      toast.success("Squad updated successfully");
    } catch (err) {
      console.error("Error al actualizar squad:", err);

      //si el error es de nombre duplicado, establecer el error en el campo
      const errorMessage = err.response?.data?.error || err.message || "";
      if (errorMessage.includes("name already in use") ||
        errorMessage.includes("nombre de squad") ||
        errorMessage.includes("already in use")) {
        form.setError("name", {
          type: "server",
          message: "This squad name is already in use",
        });
      } else {
        toast.error("Error updating squad");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeaveSquad = async () => {
    if (!userSquad) return;

    try {
      setIsLeaving(true);
      const response = await makeRequest(`squads/${userSquad.id}/leave`, "POST");

      setUserSquad(null);
      setIsLeaveDialogOpen(false);
      await refreshUser();

      if (response.deleted) {
        toast.success("You have left the squad and it has been deleted");
      } else {
        toast.success("You have left the squad successfully");
      }
    } catch (err) {
      console.error("Error al salir del squad:", err);
      toast.error("Error leaving squad");
    } finally {
      setIsLeaving(false);
    }
  };

  const renderCard = (member, index) => {
    //normalizar el rol para usar en IMG_ROLES y ROLE_COLORS
    const normalizedRole = normalizeRole(member.role);
    const roleIcon = IMG_ROLES[normalizedRole] || {
      src: IMG_DEFAULT.profileIcon.src,
      alt: "default-role",
    };

    const borderColor = ROLE_COLORS[normalizedRole] || "border-gray-600";

    return (
      <Card
        key={index}
        className={`shadow-md overflow-hidden border-4 ${borderColor} bg-neutral-900 text-white hover:bg-neutral-800`}
      >
        <CardHeader className="flex flex-wrap items-start gap-4">
          <img
            src={member.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-white object-cover flex-shrink-0"
            draggable={false}
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">{member.name}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary">{member.tier}</Badge>
              <Badge variant="outline">{member.honor}</Badge>
            </div>
          </div>
          <img
            src={roleIcon.src}
            alt={roleIcon.alt}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
        </CardHeader>
      </Card>
    );
  };

  //obtener datos del perfil del usuario actual
  const myProfile = {
    name: user?.userName || user?.contact?.name || "My Profile",
    tier: user?.lolProfile?.ranks && user?.lolProfile?.tier
      ? `${user.lolProfile.ranks} ${user.lolProfile.tier}`
      : "Unranked",
    honor: user?.lolProfile?.honor || "Honor 3",
    role: normalizeRole(user?.lolProfile?.roleLol || "Support"),
    avatar: user?.avatar || IMG_DEFAULT.profileIcon.src,
  };

  //obtener miembros del squad desde la base de datos
  const squadMembers = user?.lolProfile?.mySquad || [];

  //formatear miembros del squad para renderizar
  //manejar ambos casos: cuando userId está poblado (objeto) o cuando es solo un ID
  const formattedSquadMembers = squadMembers.map((member) => {
    //obtener userName del miembro (from DTO) o member.userId?.userName (si está poblado)
    const userName = member.userName || member.userId?.userName || "Unknown";
    //obtener avatar del miembro (from DTO) o member.userId?.avatar (si está poblado)
    const avatar = member.avatar || member.userId?.avatar || IMG_DEFAULT.avatar.src;
    //obtener ranks y tier del miembro (from DTO) o member.userId?.lolProfile (si está poblado)
    const ranks = member.ranks || member.userId?.lolProfile?.ranks;
    const tier = member.tier || member.userId?.lolProfile?.tier;
    //obtener honor del miembro (from DTO) o member.userId?.lolProfile (si está poblado)
    const honor = member.honor || member.userId?.lolProfile?.honor || "Honor 3";

    return {
      name: userName,
      tier: ranks && tier ? `${ranks} ${tier}` : "Unranked",
      honor: honor,
      role: normalizeRole(member.role || member.roleLol || member.userId?.lolProfile?.roleLol),
      avatar: avatar,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <p className="text-md text-muted-foreground pl-4">Manage Squad</p>
        {userSquad && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenEditDialog}
              className="w-auto"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLeaveDialogOpen(true)}
              className="w-auto"
            >
              Leave Squad
            </Button>
          </div>
        )}
      </div>
      {/* Mi perfil */}
      {renderCard(myProfile, "me")}

      {/* Otros miembros del squad */}
      {formattedSquadMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formattedSquadMembers.map((member, index) => renderCard(member, index))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-muted-foreground">
                There are no other members in your squad
              </p>
              <p className="text-sm text-muted-foreground">
                Invite other players from "My Matches"
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para editar el squad */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-squad-dialog-description">
          <DialogHeader>
            <DialogTitle>Edit Squad</DialogTitle>
            <DialogDescription id="edit-squad-dialog-description">
              Update the name and description of the squad. The changes will be seen in real time for all members.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveSquad)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Squad</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Name of the squad"
                        maxLength={100}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Description of the squad"
                        maxLength={500}
                        className="bg-muted flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar salir del squad */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent aria-describedby="leave-squad-dialog-description">
          <DialogHeader>
            <DialogTitle>Leave Squad</DialogTitle>
            <DialogDescription id="leave-squad-dialog-description">
              {userSquad?.membersCount === 2 ? (
                <>
                  <p className="text-destructive font-semibold mb-2">
                    Warning: This squad only has 2 members. If you leave, the squad will be deleted.
                  </p>
                  <p>Are you sure you want to leave this squad? This action cannot be undone.</p>
                </>
              ) : (
                "Are you sure you want to leave this squad? All other members will be notified."
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLeaveDialogOpen(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLeaveSquad}
              disabled={isLeaving}
            >
              {isLeaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Leaving...
                </>
              ) : (
                "Leave Squad"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
