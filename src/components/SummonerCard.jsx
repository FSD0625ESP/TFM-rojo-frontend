import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

//tarjeta para mostrar jugadores en SummonerSearch
export function SummonerCard({ summonerName, gameName, tagLine }) {
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
          setError(response.data.error);
          setSummoner(null);
          return;
        }

        setSummoner(response.data);
      } catch (err) {
        console.error("Error fetching summoner:", err);
        const errMsg =
          err.response?.data?.error || `Error al obtener datos: ${err.message}`;
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSummoner();
  }, [summonerName, gameName, tagLine]);

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

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-6 border-red-300">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-6 bg-gradient-to-br from-[#0a0a0a] to-[#1c1c1c] border-[1.5px] border-yellow-600 shadow-xl rounded-xl text-white p-6">
      <div className="flex flex-col items-center space-y-3">
        <img
          src={summoner.profileIconUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile-icon.png";
          }}
          alt="Icono de perfil"
          className="w-50 h-50 rounded-full border-4 border-yellow-500 shadow-lg p-4"
        />
        <p className="text-2xl text-yellow-700 font-bold">
          Level {summoner.summonerLevel}
        </p>
        <h2 className="text-2xl font-bold text-yellow-400 text-center">
          {summoner.summonerName}
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        <div className="text-gray-400">League</div>
        <div className="font-semibold text-yellow-300 text-right">
          {summoner.queueType}
        </div>

        <div className="text-gray-400">Rank</div>
        <div className="font-semibold text-yellow-300 text-right">
          {summoner.tier}
        </div>

        <div className="text-gray-400">Wins</div>
        <div className="font-semibold text-yellow-300 text-right">
          {summoner.wins}
        </div>

        <div className="text-gray-400">Winrate</div>
        <div className="font-semibold text-yellow-300 text-right">
          {summoner.winrate}
        </div>
      </div>
    </Card>
  );
}
