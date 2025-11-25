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

// 👇 NUEVOS IMPORTS PARA LOS MENÚS DESPLEGABLES
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// 👇 CONSTANTES DE DATOS (Las definimos fuera para que no molesten)
const REGIONS = [
  "EUW",
  "NA",
  "EUNE",
  "KR",
  "JP",
  "BR",
  "LAS",
  "LAN",
  "OCE",
  "RU",
  "TR",
];
const ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"];
const RANKS = [
  "Unranked",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];
const DIVISIONS = ["I", "II", "III", "IV"];

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
    gameName: user?.lolProfile?.gameName || "",
    tagLine: user?.lolProfile?.tagLine || "",
    region: user?.lolProfile?.region || "",
    roleLol: user?.lolProfile?.roleLol || "",
    tier: user?.lolProfile?.tier || "",
    ranks: user?.lolProfile?.ranks || "",
  });

  // 🎨 ESTILOS DINÁMICOS:
  const DISABLED_STYLE =
    "bg-secondary/40 border-transparent shadow-none focus-visible:ring-0 cursor-not-allowed text-muted-foreground opacity-70";

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
        gameName: user.lolProfile?.gameName || "",
        tagLine: user.lolProfile?.tagLine || "",
        region: user.lolProfile?.region || "",
        roleLol: user.lolProfile?.roleLol || "",
        tier: user.lolProfile?.tier || "",
        ranks: user.lolProfile?.ranks || "",
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
                  className={readOnlyClass}
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
                  className={readOnlyClass}
                />
              </div>

              {/* Email - SIEMPRE BLOQUEADO */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly={true}
                  className={DISABLED_STYLE}
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
                  className={readOnlyClass}
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
                  className={readOnlyClass}
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
                  className={readOnlyClass}
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
                className={readOnlyClass}
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
                className={readOnlyClass}
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
                className={`resize-none ${readOnlyClass}`}
              />
            </div>

            {/* SECCIÓN SUMMONER INFO (Con Selects) */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Summoner Info</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Game Name */}
                <div className="space-y-2">
                  <Label>Game Name</Label>
                  <Input
                    value={formData.gameName}
                    onChange={(e) =>
                      setFormData({ ...formData, gameName: e.target.value })
                    }
                    readOnly={!isEditing}
                    className={readOnlyClass}
                  />
                </div>

                {/* Tag Line (#) con Prefijo Visual Fijo */}
                <div className="space-y-2">
                  <Label>Tag Line</Label>
                  <div className="relative">
                    {/* SÍMBOLO # FIJO */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none font-medium">
                      #
                    </span>

                    <Input
                      placeholder="EUW"
                      value={formData.tagLine}
                      onChange={(e) => {
                        // Truco: Si el usuario escribe "#", lo borramos para que no se duplique
                        const cleanValue = e.target.value.replace(/^#/, "");
                        setFormData({ ...formData, tagLine: cleanValue });
                      }}
                      readOnly={!isEditing}
                      // Añadimos 'pl-7' (padding-left) para dejar hueco al símbolo #
                      className={`${readOnlyClass} pl-7`}
                    />
                  </div>
                </div>

                {/* REGION (SELECT) */}
                <div className="space-y-2">
                  <Label>Region</Label>
                  {isEditing ? (
                    <Select
                      value={formData.region}
                      onValueChange={(val) =>
                        setFormData({ ...formData, region: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.region}
                      readOnly
                      className={readOnlyClass}
                    />
                  )}
                </div>

                {/* MAIN ROLE (SELECT) */}
                <div className="space-y-2">
                  <Label>Main Role</Label>
                  {isEditing ? (
                    <Select
                      value={formData.roleLol}
                      onValueChange={(val) =>
                        setFormData({ ...formData, roleLol: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.roleLol}
                      readOnly
                      className={readOnlyClass}
                    />
                  )}
                </div>

                {/* RANK (SELECT) */}
                <div className="space-y-2">
                  <Label>Rank (Elo)</Label>
                  {isEditing ? (
                    <Select
                      value={formData.ranks}
                      onValueChange={(val) =>
                        setFormData({ ...formData, ranks: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rank" />
                      </SelectTrigger>
                      <SelectContent>
                        {RANKS.map((rank) => (
                          <SelectItem key={rank} value={rank}>
                            {rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.ranks}
                      readOnly
                      className={readOnlyClass}
                    />
                  )}
                </div>

                {/* TIER/DIVISION (SELECT) */}
                <div className="space-y-2">
                  <Label>Division</Label>
                  {isEditing ? (
                    <Select
                      value={formData.tier}
                      onValueChange={(val) =>
                        setFormData({ ...formData, tier: val })
                      }
                      disabled={
                        formData.ranks === "Challenger" ||
                        formData.ranks === "Grandmaster" ||
                        formData.ranks === "Master"
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map((div) => (
                          <SelectItem key={div} value={div}>
                            {div}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.tier}
                      readOnly
                      className={readOnlyClass}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Botón editar/guardar */}
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? "Guardar cambios" : "Editar perfil"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
