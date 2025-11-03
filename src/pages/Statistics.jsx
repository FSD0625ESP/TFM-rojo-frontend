import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeagueLeaderboard } from "../components/LeagueLeaderboard";
import { SummonerSearch } from "../components/SummonerSearch";
import { ChampionStats } from "../components/ChampionStats";

//página de estadísticas y acceso público (punto de entrada de la app)
export function Statistics() {
  return (
    <Tabs defaultValue="champions" className="w-full p-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="champions">Champions</TabsTrigger>
        <TabsTrigger value="search">Summoner Search</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>

      <TabsContent value="champions">
        <ChampionStats />
      </TabsContent>

      <TabsContent value="search">
        <SummonerSearch />
      </TabsContent>

      <TabsContent value="leaderboard">
        <LeagueLeaderboard />
      </TabsContent>
    </Tabs>
  );
}
