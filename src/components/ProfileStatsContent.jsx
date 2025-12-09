import { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Trophy,
  Swords,
  Target,
  History,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

//clave para el localStorage
const STATS_STORAGE_KEY = "lol_stats_cache";

//componente para el contenido de las estadísticas del perfil
export function ProfileStatsContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReloading, setIsReloading] = useState(false);
  const lastLoadedRef = useRef({ gameName: null, tagLine: null });

  //función para obtener la imagen del campeón por su nombre
  const getChampIconByName = (name) =>
    `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${name}.png`;

  //función para obtener la imagen del item por su id
  const getItemIcon = (id) =>
    `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/item/${id}.png`;

  //función para obtener la imagen del campeón por su id
  //usamos CommunityDragon que acepta IDs numéricos directamente
  const getChampImageById = (id) =>
    `https://cdn.communitydragon.org/latest/champion/${id}/square`;

  //función para verificar si los stats en cache son válidos
  const areCachedStatsValid = useCallback(() => {
    const cached = localStorage.getItem(STATS_STORAGE_KEY);
    if (!cached) return false;

    try {
      const cacheData = JSON.parse(cached);
      const currentGameName = user?.lolProfile?.gameName || "";
      const currentTagLine = user?.lolProfile?.tagLine || "";

      //verificar que el gameName y tagLine no hayan cambiado
      return (
        cacheData.gameName === currentGameName &&
        cacheData.tagLine === currentTagLine &&
        cacheData.stats
      );
    } catch {
      return false;
    }
  }, [user?.lolProfile?.gameName, user?.lolProfile?.tagLine]);

  //función para cargar stats desde cache
  const loadCachedStats = useCallback(() => {
    const cached = localStorage.getItem(STATS_STORAGE_KEY);
    if (cached) {
      try {
        const cacheData = JSON.parse(cached);
        if (cacheData.stats) {
          setStats(cacheData.stats);
          return true;
        }
      } catch {
        //si hay error al parsear, limpiar el cache
        localStorage.removeItem(STATS_STORAGE_KEY);
      }
    }
    return false;
  }, []);

  //función para obtener stats desde la API
  const fetchStats = useCallback(async (forceReload = false) => {
    try {
      if (forceReload) {
        setIsReloading(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/lol/stats`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al cargar stats");
      }
      const data = await res.json();

      //guardar en localStorage junto con gameName y tagLine
      const gameName = user?.lolProfile?.gameName || "";
      const tagLine = user?.lolProfile?.tagLine || "";

      const cacheData = {
        stats: data,
        gameName,
        tagLine,
        timestamp: Date.now(),
      };

      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(cacheData));
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  }, [user?.lolProfile?.gameName, user?.lolProfile?.tagLine]);

  //efecto único que maneja la carga inicial y los cambios en gameName/tagLine
  useEffect(() => {
    const currentGameName = user?.lolProfile?.gameName || "";
    const currentTagLine = user?.lolProfile?.tagLine || "";

    if (!currentGameName || !currentTagLine) {
      setStats(null);
      setLoading(false);
      lastLoadedRef.current = { gameName: null, tagLine: null };
      return;
    }

    //verificar si ya cargamos stats para este gameName/tagLine
    const hasChanged =
      lastLoadedRef.current.gameName !== currentGameName ||
      lastLoadedRef.current.tagLine !== currentTagLine;

    if (!hasChanged) {
      //ya cargamos stats para este gameName/tagLine, no hacer nada
      return;
    }

    //si hay stats válidos en cache, usarlos
    if (areCachedStatsValid()) {
      loadCachedStats();
      setLoading(false);
      lastLoadedRef.current = { gameName: currentGameName, tagLine: currentTagLine };
    } else {
      //si no hay stats válidos o han cambiado gameName/tagLine, hacer la llamada
      fetchStats().then(() => {
        lastLoadedRef.current = { gameName: currentGameName, tagLine: currentTagLine };
      });
    }
  }, [user?.lolProfile?.gameName, user?.lolProfile?.tagLine, areCachedStatsValid, loadCachedStats, fetchStats]);

  //función para recargar manualmente
  const handleReload = () => {
    fetchStats(true);
  };

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">Cargando historial...</div>;

  // Mostrar card cuando no hay gameName/tagLine o cuando hay error de usuario no encontrado
  const hasNoProfile = !user?.lolProfile?.gameName || !user?.lolProfile?.tagLine;
  const isUserNotFoundError = error && (
    error.includes("User not found") ||
    error.includes("Check GameName") ||
    error.includes("GameName and Region")
  );

  if (hasNoProfile || isUserNotFoundError) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Profile not configured
              </h3>
              <p className="text-sm text-muted-foreground">
                Please configure your GameName and Region in your profile settings to view your statistics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* TARJETAS SUPERIORES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {/* Card 1: Summoner */}
        <Card className="bg-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" /> Summoner
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <img
                src={stats?.summoner?.iconUrl || "/images/default-profile-icon.webp"}
                className="h-30 w-30 rounded-full border-4 border-background shadow-md p-2"
                alt="Summoner Icon"
              />
              <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2">
                Lvl {stats?.summoner?.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Ranked */}
        <Card className="bg-secondary/10 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" /> Ranked
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-center h-32">
            {stats?.rank ? (
              <div>
                <div className="text-3xl font-bold text-primary">
                  {stats.rank.tier} {stats.rank.rank}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.rank.lp} LP • <span className={stats.rank.winrate >= 50 ? "text-green-500" : "text-red-500"}>{stats.rank.winrate}% WR</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {stats.rank.wins}W - {stats.rank.losses}L
                </div>
              </div>
            ) : user?.lolProfile?.ranks && user.lolProfile.ranks !== "Unranked" && user.lolProfile.ranks !== "unranked" ? (
              <div>
                <div className="text-3xl font-bold text-primary">
                  {user.lolProfile.ranks} {["Master", "Grandmaster", "Challenger"].includes(user.lolProfile.ranks) ? "" : user.lolProfile.tier || ""}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-muted-foreground">Profile configured</span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground py-4">Unranked</div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Top Champs (Mains) */}
        <Card className="bg-secondary/10 border-blue-500/20 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Swords className="h-5 w-5 text-blue-400" /> Mains
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.topChampions?.map((c) => (
              <div
                key={c.championId}
                className="flex items-center gap-3 text-sm bg-background/40 p-2 rounded-md"
              >
                {/* LA IMAGEN DEL CAMPEÓN INTEGRADA */}
                <img
                  src={getChampImageById(c.championId)}
                  alt="Champ"
                  className="h-10 w-10 rounded-full border border-border"
                />

                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-muted-foreground">Mastery {c.championLevel}</span>
                    <span>{c.championPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.topChampions || stats.topChampions.length === 0) && (
              <div className="text-center text-muted-foreground text-xs">No mastery data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECCIÓN: HISTORIAL DE PARTIDAS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <History className="h-5 w-5" /> Match History
          </h3>
          <Button

            size="sm"
            onClick={handleReload}
            disabled={isReloading || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`} />
            {isReloading ? "Loading..." : "Reload"}
          </Button>
        </div>
        <div className="space-y-3">
          {stats?.matchHistory?.map((match) => (
            <Card
              key={match.matchId}
              className={`border-l-4 transition-all hover:bg-secondary/5 ${match.win
                ? "border-l-green-500 bg-green-500/5"
                : "border-l-red-500 bg-red-500/5"
                }`}
            >
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Info Básica: Campeón + Resultado */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative">
                    <img
                      src={getChampIconByName(match.championName)}
                      alt={match.championName}
                      className="h-12 w-12 rounded-md shadow-sm"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 text-[10px] h-5 px-1 border border-border"
                    >
                      {match.cs} CS
                    </Badge>
                  </div>
                  <div>
                    <div
                      className={`font-bold ${match.win ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {match.win ? "Victory" : "Defeat"}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase font-medium">
                      {match.gameMode}
                    </div>
                  </div>
                </div>

                {/* KDA */}
                <div className="text-center flex-1">
                  <div className="text-lg font-bold tracking-wider">
                    {match.kills} / <span className="text-red-500">{match.deaths}</span> / {match.assists}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {match.kda}:1 KDA
                  </div>
                </div>

                {/* Items */}
                <div className="flex gap-1 mt-2 md:mt-0">
                  {match.items.map((item, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 bg-black/20 rounded-md overflow-hidden border border-white/5"
                    >
                      {item > 0 && (
                        <img
                          src={getItemIcon(item)}
                          className="h-full w-full object-cover"
                          alt="Item"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {(!stats?.matchHistory || stats.matchHistory.length === 0) && (
            <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
              No recent matches found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}