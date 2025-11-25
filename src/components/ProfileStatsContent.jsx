import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card"; // Corregido de ../components/ui/card a ./ui/card
import { Badge } from "./ui/badge"; // Corregido de ../components/ui/badge a ./ui/badge
import { Skeleton } from "./ui/skeleton"; // Corregido de ../components/ui/skeleton a ./ui/skeleton
import {
  Trophy,
  Swords,
  Target,
  History,
} from "lucide-react";

export function ProfileStatsContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Para el Historial (Riot nos da el NOMBRE, ej: "Aatrox")
  const getChampIconByName = (name) =>
    `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${name}.png`;

  // 2. Para los Items (Riot nos da el ID, ej: 3031)
  const getItemIcon = (id) =>
    `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/item/${id}.png`;

  // 3. ✅ NUEVO: Para los Mains (Riot nos da el ID, ej: 266 -> Aatrox)
  // Usamos CommunityDragon que acepta IDs numéricos directamente
  const getChampImageById = (id) => 
    `https://cdn.communitydragon.org/latest/champion/${id}/square`;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/lol/stats`, {
          credentials: "include",
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Error al cargar stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">Cargando historial...</div>; // O tu skeleton bonito

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- TARJETAS SUPERIORES --- */}
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
                src={stats?.summoner?.iconUrl}
                className="h-24 w-24 rounded-full border-4 border-background shadow-md"
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
            ) : (
              <div className="text-muted-foreground py-4">Unranked</div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Top Champs (Mains) */}
        <Card className="bg-secondary/10 border-blue-500/20">
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
                {/* ✅ AQUÍ ESTÁ LA IMAGEN DEL CAMPEÓN INTEGRADA */}
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

      {/* --- SECCIÓN: HISTORIAL DE PARTIDAS --- */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History className="h-5 w-5" /> Match History
        </h3>
        <div className="space-y-3">
          {stats?.matchHistory?.map((match) => (
            <Card
              key={match.matchId}
              className={`border-l-4 transition-all hover:bg-secondary/5 ${
                match.win
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
                      className={`font-bold ${
                        match.win ? "text-green-500" : "text-red-500"
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