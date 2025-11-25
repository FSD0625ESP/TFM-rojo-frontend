// ProfileHeader.jsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Camera, Calendar, Shield, Flame, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { IMG_DEFAULT } from "../constants/images";

export function ProfileHeader() {
  const { user, updateUser } = useAuth();

  const [isCopied, setIsCopied] = useState(false);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      console.log("📡 [FRONTEND] Enviando imagen..."); // LOG 1
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/upload-avatar`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Error en la subida");

      const updatedUser = await res.json();
      console.log("📥 [FRONTEND] Respuesta recibida:", updatedUser); // LOG 2
      console.log("🖼️ [FRONTEND] Nuevo Avatar URL:", updatedUser.avatar); // LOG 3
      updateUser(updatedUser);
    } catch (err) {
      console.error("Error al subir avatar:", err);
    }
  };

  // 👇 FUNCIÓN PARA COPIAR "NOMBRE#TAG"
  const handleCopyRiotId = () => {
    if (!user?.lolProfile?.gameName || !user?.lolProfile?.tagLine) return;

    // Creamos el string completo sin espacios extra alrededor del #
    const fullId = `${user.lolProfile.gameName}#${user.lolProfile.tagLine}`;

    navigator.clipboard.writeText(fullId);

    // Animación del icono
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* SECCIÓN AVATAR */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.avatar || IMG_DEFAULT.avatar.src}
                alt="avatar"
                draggable={false}
                className="select-none object-cover"
              />
              <AvatarFallback className="text-2xl">
                {user?.userName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
              onClick={() => document.getElementById("avatarUpload").click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input
              type="file"
              id="avatarUpload"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* SECCIÓN INFO */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold">{user?.userName}</h1>
            <Badge variant="secondary">
              {user?.role !== "user" ? "Admin" : ""} Summoner
            </Badge>

            {/* 👇 AQUÍ ESTÁ EL CAMBIO: Nombre + #Tag + Botón Copiar */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <p>
                {user?.lolProfile?.gameName && user?.lolProfile?.tagLine
                  ? `${user.lolProfile.gameName} #${user.lolProfile.tagLine}`
                  : "Game name #Tag"}
              </p>

              {/* Botón Copiar (Solo aparece si hay datos) */}
              {user?.lolProfile?.gameName && user?.lolProfile?.tagLine && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-transparent"
                  onClick={handleCopyRiotId}
                  title="Copiar Riot ID"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 opacity-70 hover:opacity-100" />
                  )}
                </Button>
              )}
            </div>

            {/* SECCIÓN ESTADÍSTICAS */}
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm pt-1">
              <div className="flex items-center gap-1">
                <Shield className="size-4" /> Tier:{" "}
                {user?.lolProfile?.ranks
                  ? ["Master", "Grandmaster", "Challenger"].includes(
                      user.lolProfile.ranks
                    )
                    ? user.lolProfile.ranks // Si es Master+, solo muestra el Rango
                    : `${user.lolProfile.ranks} ${user?.lolProfile?.tier || ""}` // Si no, muestra Rango + División
                  : "Unranked"}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="size-4" /> Role:{" "}
                {user?.lolProfile?.roleLol || "Fill"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" /> Region:{" "}
                {user?.lolProfile?.region || "EUW"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
