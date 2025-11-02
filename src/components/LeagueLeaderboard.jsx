import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import {
  QUEUE_OPTIONS,
  TIER_OPTIONS,
  DIVISION_OPTIONS,
} from "../constants/filters";

// Asumiendo que el backend monta la ruta League en /api/riot/league
const API_BASE_URL = import.meta.env.VITE_API_URL;

//listar y filtrar jugadores
export function LeagueLeaderboard() {
  const [queue, setQueue] = useState(QUEUE_OPTIONS[0].value);
  const [tier, setTier] = useState(TIER_OPTIONS[3].value); // Diamante por defecto
  const [division, setDivision] = useState(DIVISION_OPTIONS[0].value); // I por defecto
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPlayers([]);

    // La URL final en el backend deberá ser algo como:
    // /api/riot/league/RANKED_SOLO_5x5/DIAMOND/I
    const url = `${API_BASE_URL}/lol/league/${queue}/${tier}/${division}`;
    console.log("Fetching leaderboard from URL:", url);
    try {
      const response = await axios.get(url);
      // El endpoint de Riot devuelve un array de objetos
      setPlayers(response.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      const errMsg =
        err.response?.data?.error ||
        `Error al obtener la lista: ${err.message}`;
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [queue, tier, division]);

  // Cargar datos al montar el componente o al cambiar filtros
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Función para calcular el ratio de victorias
  const calculateWinRatio = (wins, losses) => {
    const total = wins + losses;
    return total === 0 ? "0%" : `${((wins / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Players Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6 items-end">
            {/* 1. Tipo de Cola */}
            {/* w-full en móvil, sm:w-1/3 en escritorio */}
            <div className="w-full xs:w-1/2 sm:w-1/3">
              <label className="text-sm font-medium mb-1 block">League</label>
              <Select
                value={queue}
                onValueChange={setQueue}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la cola" />
                </SelectTrigger>
                <SelectContent>
                  {QUEUE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Nivel (Tier) */}
            {/* w-1/2 en móvil, sm:w-1/4 en escritorio. Usa gap-2 para que quepan 3 en móvil */}
            <div className="w-1/2 xs:w-1/4 sm:w-1/4">
              <label className="text-sm font-medium mb-1 block">Range</label>
              <Select value={tier} onValueChange={setTier} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. División */}
            {tier !== "CHALLENGER" &&
              tier !== "GRANDMASTER" &&
              tier !== "MASTER" && (
                <div className="w-1/2 xs:w-1/4 sm:w-1/5">
                  <label className="text-sm font-medium mb-1 block">
                    Level
                  </label>
                  <Select
                    value={division}
                    onValueChange={setDivision}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="División" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVISION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            {/* 4. Botón Aplicar Filtro */}
            {/* Se ajusta para que esté debajo y tome el ancho completo en móvil, pero se alinea a la derecha en escritorio */}
            <Button
              onClick={fetchLeaderboard}
              disabled={isLoading}
              className="w-full mt-2 sm:w-auto sm:mt-0"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Filter"
              )}
            </Button>
          </div>

          {/* --- Mensajes de Estado --- */}
          {error && (
            <p className="text-red-600 bg-red-50 p-3 border border-red-200 rounded-md mb-4">
              {error}
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">
                Loading data from Riot...
              </p>
            </div>
          )}

          {/* --- Tabla de Resultados --- */}
          {!isLoading && players.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Summoner</TableHead>
                    <TableHead className="text-right">LP</TableHead>
                    <TableHead className="text-right">Win</TableHead>
                    <TableHead className="text-right">Ratio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players
                    // Ordenar por League Points (LP) de mayor a menor
                    .sort((a, b) => b.leaguePoints - a.leaguePoints)
                    .map((player, index) => (
                      <TableRow key={player.puuid}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {player.summonerName || "Summoner Default"}
                        </TableCell>
                        <TableCell className="text-right">
                          {player.leaguePoints}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {player.wins}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {calculateWinRatio(player.wins, player.losses)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && players.length === 0 && !error && (
            <p className="text-sm text-center text-muted-foreground mt-8">
              No se encontraron jugadores en la liga y división seleccionada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
