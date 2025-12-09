import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { SummonerCard } from "./SummonerCard";
import { AlertModal } from "./AlertModal";
import { Card } from "./ui/card";

//formulario para buscar jugadores por Riot ID
export function SummonerSearch() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = gameName.trim() === "" || tagLine.trim() === "";

  const handleSearch = () => {
    if (isDisabled) return;

    setLoading(true);
    setSearchParams({ gameName, tagLine });
    setShowError(false);
    setLoading(false);
  };

  const handleError = () => {
    setShowError(true);
    //limpiar los inputs para evitar que el diálogo se muestre en bucle
    setGameName("");
    setTagLine("");
    //resetear searchParams para volver a la card por defecto inicial
    setSearchParams(null);
  };

  return (
    <div className="w-full py-2 md:py-4">
      <Card>
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

          {/* SummonerCard - gestiona todos los estados (default, loading, error, success) */}
          <SummonerCard
            gameName={searchParams?.gameName}
            tagLine={searchParams?.tagLine}
            onError={handleError}
          />

          {/* Error Modal - se muestra cuando no se encuentra el summoner */}
          <AlertModal
            open={showError}
            onClose={() => setShowError(false)}
            title="Summoner not found"
            message="Verify that the Riot ID is correct. Make sure to use the correct region."
            variant="error"
            actions={[
              {
                label: "Close",
                onClick: () => setShowError(false),
                variant: "outline",
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
}
