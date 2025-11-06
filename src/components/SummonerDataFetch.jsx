import { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { AlertModal } from "./AlertModal";

const API_BASE_URL = import.meta.env.VITE_API_URL;

//función para realizar la petición al backend desde SummonerSearch
export function SummonerDataFetcher() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [summonerData, setSummonerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const fetchData = useCallback(async () => {
    if (!gameName || !tagLine) {
      const errMsg = "Please enter the Game Name and Tag.";
      setError(errMsg);
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummonerData(null);

    //1-construir la URL con los parámetros codificados
    //debemos usar encodeURIComponent para manejar espacios (ej: "Sung Jin woo")
    const encodedGameName = encodeURIComponent(gameName);
    const encodedTagLine = encodeURIComponent(tagLine);

    //url final: /api/riot/Sung%20Jin%20woo/SOUL
    const url = `${API_BASE_URL}lol/${encodedGameName}/${encodedTagLine}`;

    try {
      //2-llamada al backend
      const response = await axios.get(url);
      console.log(response.data);
      //3-almacenar los datos recibidos
      setSummonerData(response.data);
    } catch (err) {
      //4-manejo de errores
      console.error("Error searching summoner:", err);
      const errMsg = err.response?.data?.error || `Error: ${err.message}`;
      setError(errMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  }, [gameName, tagLine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  //función de ayuda para la visualización de los datos
  const renderSummonerCard = () => {
    if (!summonerData) return null;

    const { name, summonerLevel, puuid, id } = summonerData;

    return (
      <Card className="mt-8 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-5xl font-bold">
            {name || "SUMMONNER"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Level:</strong> {summonerLevel ?? "Unknown"}
          </p>
          {puuid && (
            <p className="text-md text-muted-foreground break-words">
              <strong>Summoner ID (PUUID):</strong> {puuid.substring(0, 80)}
            </p>
          )}
          {id && (
            <p className="text-sm text-muted-foreground ">
              ID de Invocador: {id.substring(0, 15)}...
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Summoner Search</h1>

      {/* Formulario de Búsqueda */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <Input
          placeholder="Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
        />
        <Input
          placeholder="Tag"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          className="w-24"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {/* Error Modal */}
      <AlertModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Summoner not found"
        message={
          (error ||
            "Verify that the Riot ID is correct. Make sure to use the correct region.") +
          " [Request failed]"
        }
        variant="error"
        actions={[
          {
            label: "Close",
            onClick: () => setShowError(false),
            variant: "outline",
          },
        ]}
      />

      {/* Mostrar Datos */}
      {renderSummonerCard()}
    </div>
  );
}
