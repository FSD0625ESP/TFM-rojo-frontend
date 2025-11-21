import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { SummonerCard } from "./SummonerCard";
import { AlertModal } from "./AlertModal";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { IMG_DEFAULT } from "../constants/images";

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

          {/* Default Card (when no search) */}
          {!searchParams && (
            <Card className="w-full max-w-sm mx-auto mt-6 bg-neutral-900 rounded-xl border-4 border-gray-600 text-white p-0 h-[500px] opacity-60 grayscale">
              {/* Grid principal: 50% superior y 50% inferior */}
              <div className="grid grid-rows-2 h-full">
                {/* 50% superior: Avatar y Username */}
                <div className="flex flex-col items-center justify-center gap-3 p-6 border-b-2 border-white/20">
                  <img
                    src={IMG_DEFAULT.profileIcon.src}
                    alt="Placeholder"
                    draggable={false}
                    className="w-40 h-40 rounded-full border-4 border-gray-400 object-cover select-none"
                  />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-400">
                      Summoner Name
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
          )}

          {/* Result */}
          {searchParams && (
            <SummonerCard
              {...searchParams}
              onError={() => {
                setSearchParams(null);
                setShowError(true);
              }}
            />
          )}

          {/* Error Modal */}
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
