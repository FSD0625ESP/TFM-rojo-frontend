import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
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

//importar constantes externas
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
  const [sortColumn, setSortColumn] = useState("winRate"); // "name", "tier", "role", "winRate", "pickRate"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" o "desc"

  //simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChampions(MOCK_CHAMPIONS);
      setVisibleCount(10); //reiniciar al cambiar filtros
      setIsLoading(false);
    }, 100);
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

  //lógica de ordenamiento
  const sortedChampions = [...filteredChampions].sort((a, b) => {
    if (!sortColumn) return 0;

    const valA = a[sortColumn];
    const valB = b[sortColumn];

    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });

  //muestra solo los 10 campeones visibles de manera ordenada (según visibleCount)
  const visibleChampions = sortedChampions.slice(0, visibleCount);

  //handler para cambiar el ordenamiento al hacer clic en el encabezado de la tabla
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full py-2 sm:py-2">
      <Card className="py-0">
        <CardContent className="flex flex-col gap-1 p-2">
          {/* Filtros desplegables */}
          <div className="flex flex-wrap justify-center gap-4 mb-6 w-full sm:cols-1 md:cols-2 lg:cols-4">
            {/* Patch */}
            <div className="flex-grow min-w-[150px] max-w-full">
              <Select value={patch} onValueChange={setPatch}>
                <SelectTrigger className="bg-muted text-sm font-medium w-full">
                  <SelectValue placeholder="Patch" />
                </SelectTrigger>
                <SelectContent>
                  {PATCH_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {`Patch ${p.label}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="flex-grow min-w-[150px] max-w-full">
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
            <div className="flex-grow min-w-[150px] max-w-full">
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
            <div className="flex-grow min-w-[150px] max-w-full">
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

          {/* Tabs de roles para filtrar */}
          <Tabs
            defaultValue="ALL"
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              setVisibleCount(10); //reiniciar al cambiar rol
            }}
            className="w-full mb-4"
          >
            <TabsList className="flex w-full overflow-x-auto no-scrollbar gap-1 md:gap-4">
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
                      {/* Encabezados con funcionalidad de ordenamiento */}
                      <TableHead
                        onClick={() => handleSort("name")}
                        className="cursor-pointer"
                      >
                        Champion{" "}
                        {sortColumn === "name" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("tier")}
                        className="text-center cursor-pointer"
                      >
                        Tier{" "}
                        {sortColumn === "tier" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("role")}
                        className="text-center cursor-pointer"
                      >
                        Role{" "}
                        {sortColumn === "role" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("winRate")}
                        className="text-center md:text-right cursor-pointer"
                      >
                        WR{" "}
                        {sortColumn === "winRate" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("pickRate")}
                        className="text-center md:text-right cursor-pointer"
                      >
                        PR{" "}
                        {sortColumn === "pickRate" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleChampions.map((champ) => (
                      <TableRow key={champ.id}>
                        <TableCell className="flex items-center gap-2 font-medium md:text-lg">
                          <img
                            src={champ.icon}
                            alt={champ.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {champ.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <img
                            src={champ.tier}
                            alt="Tier icon"
                            width={32}
                            height={32}
                            className="mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <img
                            src={
                              ROLE_OPTIONS.find((r) => r.value === champ.role)
                                ?.src
                            }
                            alt={`${champ.role} icon`}
                            width={24}
                            height={24}
                            className="mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {champ.winRate.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {champ.pickRate.toFixed(1)}%
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

              {/* Botón para agregar 10 campeones más */}
              {visibleCount < filteredChampions.length && (
                <div className="flex justify-center my-2">
                  <Button
                    variant="secondary"
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                  >
                    Add more champions
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
