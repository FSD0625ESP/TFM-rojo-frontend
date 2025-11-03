import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

// Importar constantes externas
import {
  QUEUE_OPTIONS,
  RANKS_OPTIONS,
  REGION_OPTIONS,
  PATCH_OPTIONS,
  ROLE_OPTIONS,
} from "../constants/filters";
import { MOCK_CHAMPIONS } from "../mocks/champions.js";

//function principal del componente ChampionStats
export function ChampionStats() {
  const [patch, setPatch] = useState(PATCH_OPTIONS[1].value); // "15.21"
  const [region, setRegion] = useState(REGION_OPTIONS[0].value); // "Global"
  const [rank, setRank] = useState(RANKS_OPTIONS[4].value); // "EMERALD"
  const [queue, setQueue] = useState(QUEUE_OPTIONS[0].value); // "RANKED_SOLO_5x5"
  const [champions, setChampions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(10); //mostrar 10 por defecto

  //simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChampions(MOCK_CHAMPIONS);
      setVisibleCount(10); //reiniciar al cambiar filtros
      setIsLoading(false);
    }, 800);
  }, [patch, region, rank, queue]);

  //lógica de filtrado y paginación
  const filteredChampions = champions.filter(
    (champ) =>
      (selectedRole === "ALL" || champ.role === selectedRole) &&
      champ.patch === patch &&
      champ.region === region &&
      champ.rank === rank &&
      champ.queue === queue
  );

  const visibleChampions = filteredChampions.slice(0, visibleCount);

  return (
    <div className="w-full py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Champion Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros desplegables */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
            {/* Patch */}
            <div className="flex-grow min-w-[150px] max-w-[220px]">
              <Select value={patch} onValueChange={setPatch}>
                <SelectTrigger className="bg-muted text-sm font-medium w-full">
                  <SelectValue placeholder="Patch" />
                </SelectTrigger>
                <SelectContent>
                  {PATCH_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="flex-grow min-w-[150px] max-w-[220px]">
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="bg-muted text-sm font-medium w-full">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rank */}
            <div className="flex-grow min-w-[150px] max-w-[220px]">
              <Select value={rank} onValueChange={setRank}>
                <SelectTrigger className="bg-muted text-sm font-medium w-full">
                  <SelectValue placeholder="Rank" />
                </SelectTrigger>
                <SelectContent>
                  {RANKS_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Queue */}
            <div className="flex-grow min-w-[150px] max-w-[220px]">
              <Select value={queue} onValueChange={setQueue}>
                <SelectTrigger className="bg-muted text-sm font-medium w-full">
                  <SelectValue placeholder="Queue" />
                </SelectTrigger>
                <SelectContent>
                  {QUEUE_OPTIONS.map((q) => (
                    <SelectItem key={q.value} value={q.value}>
                      {q.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs de roles */}
          <Tabs
            defaultValue="ALL"
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              setVisibleCount(10); //reiniciar al cambiar rol
            }}
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-2">
              {ROLE_OPTIONS.map((role) => (
                <TabsTrigger key={role.value} value={role.value}>
                  {role.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Tabla de campeones */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-lg text-muted-foreground">
                Loading champion stats...
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Champion</TableHead>
                      <TableHead className="text-center">Tier</TableHead>
                      <TableHead className="text-center">Role</TableHead>
                      <TableHead className="text-right">Win Rate</TableHead>
                      <TableHead className="text-right">Pick Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleChampions.map((champ) => (
                      <TableRow key={champ.id}>
                        <TableCell className="flex items-center gap-2 font-medium">
                          <img
                            src={champ.icon}
                            alt={champ.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {champ.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {champ.tier}
                        </TableCell>
                        <TableCell className="text-center">
                          {champ.role}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {champ.winRate.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {champ.pickRate.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mensaje para cuando no hay resultados */}
              {filteredChampions.length === 0 && !isLoading && (
                <p className="text-center text-muted-foreground mt-4">
                  No se encontraron campeones con los filtros seleccionados.
                </p>
              )}

              {/* Botón para agregar más */}
              {visibleCount < filteredChampions.length && (
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setVisibleCount((prev) => prev + 10)}>
                    Agregar más
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
