import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { SummonerCard } from "./SummonerCard";
import { fetchSummoner } from "../services/riotService";
import { AlertModal } from "./AlertModal";

//formulario para buscar jugadores por Riot ID
export function SummonerSearch() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = gameName.trim() === "" || tagLine.trim() === "";

  const handleSearch = async () => {
    if (isDisabled) return;

    setLoading(true);
    try {
      await fetchSummoner(gameName, tagLine);
      setSearchParams({ gameName, tagLine });
      setShowError(false);
    } catch (err) {
      console.error("Error al buscar invocador:", err);
      setSearchParams(null);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">SEARCH BY RIOT ID</span>
        <Button onClick={handleSearch} disabled={isDisabled || loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Summoner Search"
          )}
        </Button>
      </div>

      {/* Inputs */}
      <div className="flex gap-2 w-full">
        <Input
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="w-1/2 bg-white text-black border border-gray-300 rounded-md"
        />
        <Input
          placeholder="#Tag Line"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          className="w-1/2 bg-white text-black border border-gray-300 rounded-md"
        />
      </div>

      {/* Result */}
      {searchParams && <SummonerCard {...searchParams} />}

      {/* Error Modal */}
      <AlertModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Invocador no encontrado"
        message="Verificá que el Riot ID sea correcto. Asegurate de usar la región adecuada."
        variant="error"
        actions={[
          {
            label: "Cerrar",
            onClick: () => setShowError(false),
            variant: "outline",
          },
        ]}
      />

    </div>
  );
}
