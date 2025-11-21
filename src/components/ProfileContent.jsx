// ProfileContent.jsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export function ProfileContent() {
  const { user, updateUser } = useAuth();

  // Estado para edición y datos del formulario
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.contact?.name || "",
    lastName: user?.contact?.lastname || "",
    email: user?.email || "",
    phone: user?.contact?.phone || "",
    city: user?.address?.city || "",
    country: user?.address?.country || "",
    discord: user?.contact?.discord || "",
    hobbies: user?.contact?.hobbies || "",
    bio: user?.profile?.bio || "",
  });

  // 🎨 ESTILOS DINÁMICOS:
  // Si NO estamos editando (!isEditing), aplicamos estas clases para "apagar" los inputs.
  // "bg-secondary/40": Fondo grisáceo oscuro (ajústalo si quieres más o menos transparencia).
  // "border-transparent": Quita el borde blanco/gris.
  // "shadow-none": Quita sombras.
  // "focus-visible:ring-0": Quita el anillo azul/blanco al hacer click.
  const readOnlyClass = !isEditing
    ? "bg-secondary/40 border-transparent shadow-none focus-visible:ring-0 cursor-default text-muted-foreground"
    : "";

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.contact?.name || "",
        lastName: user.contact?.lastname || "",
        email: user.email || "",
        phone: user.contact?.phone || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
        discord: user.contact?.discord || "",
        hobbies: user.contact?.hobbies || "",
        bio: user.profile?.bio || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/update-profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error al guardar perfil");

      const updatedUser = await res.json();
      updateUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    }
  };

  return (
    <Tabs defaultValue="personal">
      <TabsContent value="personal" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={readOnlyClass} // <--- APLICADO AQUÍ
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* Discord */}
              <Label htmlFor="discord">Discord</Label>
              <Input
                id="discord"
                value={formData.discord}
                onChange={(e) =>
                  setFormData({ ...formData, discord: e.target.value })
                }
                readOnly={!isEditing}
                className={readOnlyClass} // <--- APLICADO AQUÍ
              />

              {/* Hobbies */}
              <Label htmlFor="hobbies">Hobbies</Label>
              <Input
                id="hobbies"
                value={formData.hobbies}
                onChange={(e) =>
                  setFormData({ ...formData, hobbies: e.target.value })
                }
                readOnly={!isEditing}
                className={readOnlyClass} // <--- APLICADO AQUÍ
              />

              {/* Bio (Textarea) */}
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                readOnly={!isEditing}
                rows={6}
                // Para el textarea añadimos resize-none para que no se pueda estirar si no estamos editando
                className={`resize-none ${readOnlyClass}`} 
              />
            </div>

            {/* Botón editar/guardar */}
            <Button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? "Guardar cambios" : "Editar perfil"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}