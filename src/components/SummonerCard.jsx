import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { IMG_DEFAULT, IMG_ROLES } from "../constants/images";

const API_BASE = import.meta.env.VITE_API_URL;

//tarjeta para mostrar jugadores en SummonerSearch
export function SummonerCard({ summonerName, gameName, tagLine, onError }) {
  const [summoner, setSummoner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummoner = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = summonerName
          ? `${API_BASE}/lol/summoner?summonerName=${encodeURIComponent(
            summonerName
          )}`
          : `${API_BASE}/lol/summoner?gameName=${encodeURIComponent(
            gameName
          )}&tagLine=${encodeURIComponent(tagLine)}`;

        const response = await axios.get(query);

        if (response.data.error) {
          const errMsg = response.data.error;
          setError(errMsg);
          setSummoner(null);
          if (onError) onError(errMsg);
          return;
        }

        setSummoner(response.data);
      } catch (err) {
        console.error("Error fetching summoner:", err);
        const errMsg =
          err.response?.data?.error || `Error al obtener datos: ${err.message}`;
        setError(errMsg);
        if (onError) onError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSummoner();
  }, [summonerName, gameName, tagLine, onError]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Cargando jugador...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  //no renderizamos errores aquí; el padre mostrará el modal
  if (error) return null;

  // Parsear tier para separar rank y tier
  const tierParts = summoner.tier ? summoner.tier.split(" ") : [];
  const rank = tierParts.length > 0 ? tierParts[0] : "Unranked";
  const tier = tierParts.length > 1 ? tierParts[1] : (tierParts[0] && tierParts[0] !== "Unranked" ? tierParts[0] : "N/A");

  return (
    <Card className="w-full max-w-sm mx-auto mt-6 bg-neutral-900 rounded-xl border-4 border-yellow-600 text-white p-0 h-[500px]">
      {/* Grid principal: 50% superior y 50% inferior */}
      <div className="grid grid-rows-2 h-full">
        {/* 50% superior: Avatar y Username */}
        <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
          <img
            src={summoner.profileIconUrl}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = IMG_DEFAULT.profileIcon.src;
            }}
            alt="Icono de perfil"
            draggable={false}
            className="w-40 h-40 rounded-full border-4 border-white object-cover select-none"
          />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">
              {summoner.summonerName}
            </h3>
            <p className="text-sm text-white/70 mt-1">
              Level {summoner.summonerLevel}
            </p>
          </div>
        </div>

        {/* 50% inferior: 4 cuadrantes */}
        <div className="grid grid-cols-2 grid-rows-2">
          {/* Cuadrante 1: Rank */}
          <div className="flex flex-col items-center justify-center p-4 border-r-2 border-b-2 border-white/20 bg-neutral-800/50">
            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
              Rank
            </span>
            <Badge variant="secondary" className="text-xl font-semibold">
              {rank}
            </Badge>
          </div>

          {/* Cuadrante 2: Tier */}
          <div className="flex flex-col items-center justify-center p-4 border-b-2 border-white/20 bg-neutral-800/50">
            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
              Tier
            </span>
            <Badge variant="outline" className="text-xl font-semibold border-white/30 text-white">
              {tier}
            </Badge>
          </div>

          {/* Cuadrante 3: Queue */}
          <div className="flex flex-col items-center justify-center p-4 border-r-2 border-white/20 bg-neutral-800/50">
            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
              Queue
            </span>
            <span className="text-sm font-semibold text-white text-center px-2">
              {summoner.queueType || "N/A"}
            </span>
          </div>

          {/* Cuadrante 4: Winrate */}
          <div className="flex flex-col items-center justify-center p-4 bg-neutral-800/50">
            <span className="text-xs text-white/70 mb-2 font-medium uppercase">
              Winrate
            </span>
            <span className="text-xl font-semibold text-white">
              {summoner.winrate || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
