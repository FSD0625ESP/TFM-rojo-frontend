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
//gestiona todos los estados: card por defecto, loading, error y datos reales
export function SummonerCard({ summonerName, gameName, tagLine, onError }) {
  const [summoner, setSummoner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //comprobar si hay parámetros para hacer la búsqueda
  const hasSearchParams = summonerName || (gameName && tagLine);

  useEffect(() => {
    //solo hacer la petición si hay parámetros
    if (!hasSearchParams) {
      setLoading(false);
      setError(null);
      setSummoner(null);
      return;
    }

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

        //validar que los datos recibidos sean válidos
        const data = response.data;
        //verificar si el objeto está vacío o no tiene los campos esenciales
        if (!data || Object.keys(data).length === 0 || !data.summonerName) {
          const errMsg = "Summoner no encontrado";
          setError(errMsg);
          setSummoner(null);
          if (onError) onError(errMsg);
          return;
        }

        setSummoner(data);
      } catch (err) {
        console.error("Error fetching summoner:", err);
        const errMsg =
          err.response?.data?.error || `Error al obtener datos: ${err.message}`;
        setError(errMsg);
        setSummoner(null);
        if (onError) onError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSummoner();
  }, [summonerName, gameName, tagLine, onError, hasSearchParams]);

  //tarjeta por defecto (sin búsqueda o con error después de cargar)
  const showDefaultCard = !hasSearchParams || (error && !loading) || (!loading && !summoner && hasSearchParams);

  if (showDefaultCard && !loading) {
    return (
      <Card className="w-full max-w-sm mx-auto mt-6 bg-neutral-900 rounded-xl border-4 border-gray-600 text-white p-0 h-[500px] opacity-60 grayscale">
        {/* Grid principal: 50% superior y 50% inferior */}
        <div className="grid grid-rows-2 h-full">
          {/* 50% superior: Avatar y Username */}
          <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
            <img
              src={IMG_DEFAULT.profileIcon.src}
              alt="Default Profile Icon"
              draggable={false}
              className="w-40 h-40 rounded-full border-4 p-4 border-gray-400 object-cover select-none"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-400">
                {loading ? "Cargando..." : error ? "Error al cargar" : "Summoner Name"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Level --
              </p>
            </div>
          </div>

          {/* 50% inferior: 4 cuadrantes */}
          <div className="grid grid-cols-2 grid-rows-2">
            {/* Cuadrante 1: Rank */}
            <div className="flex flex-col items-center justify-center p-4 border-r-2 border-b-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">
                Rank
              </span>
              <Badge variant="secondary" className="text-xl font-semibold bg-gray-600 text-gray-300">
                --
              </Badge>
            </div>

            {/* Cuadrante 2: Tier */}
            <div className="flex flex-col items-center justify-center p-4 border-b-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">
                Tier
              </span>
              <Badge variant="outline" className="text-xl font-semibold border-gray-500 text-gray-400">
                --
              </Badge>
            </div>

            {/* Cuadrante 3: Queue */}
            <div className="flex flex-col items-center justify-center p-4 border-r-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">
                Queue
              </span>
              <span className="text-sm font-semibold text-gray-400 text-center px-2">
                --
              </span>
            </div>

            {/* Cuadrante 4: Winrate */}
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">
                Winrate
              </span>
              <span className="text-xl font-semibold text-gray-400">
                --
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  //estado de carga
  if (loading) {
    return (
      <Card className="w-full max-w-sm mx-auto mt-6 bg-neutral-900 rounded-xl border-4 border-gray-600 text-white p-0 h-[500px] opacity-60 grayscale">
        <div className="grid grid-rows-2 h-full">
          <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
            <Loader2 className="w-40 h-40 animate-spin text-gray-400" />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-400">
                Cargando...
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Level --
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2">
            <div className="flex flex-col items-center justify-center p-4 border-r-2 border-b-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">Rank</span>
              <Badge variant="secondary" className="text-xl font-semibold bg-gray-600 text-gray-300">--</Badge>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-b-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">Tier</span>
              <Badge variant="outline" className="text-xl font-semibold border-gray-500 text-gray-400">--</Badge>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-r-2 border-white/20 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">Queue</span>
              <span className="text-sm font-semibold text-gray-400 text-center px-2">--</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-800/50">
              <span className="text-xs text-gray-500 mb-2 font-medium uppercase">Winrate</span>
              <span className="text-xl font-semibold text-gray-400">--</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  //parsear tier para separar rank y tier
  const tierParts = summoner.tier ? summoner.tier.split(" ") : [];
  const rank = tierParts.length > 0 ? tierParts[0] : "Unranked";
  const tier = tierParts.length > 1 ? tierParts[1] : (tierParts[0] && tierParts[0] !== "Unranked" ? tierParts[0] : "N/A");

  //tarjeta con datos reales
  return (
    <Card className="w-full max-w-sm mx-auto mt-6 bg-neutral-900 rounded-xl border-4 border-yellow-600 text-white p-0 h-[500px]">
      {/* Grid principal: 50% superior y 50% inferior */}
      <div className="grid grid-rows-2 h-full">
        {/* 50% superior: Avatar y Username */}
        <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
          <img
            src={summoner.profileIconUrl || IMG_DEFAULT.profileIcon.src}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = IMG_DEFAULT.profileIcon.src;
            }}
            alt="Icono de perfil"
            draggable={false}
            className="w-40 h-40 rounded-full border-4 p-4 border-white object-cover select-none"
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
