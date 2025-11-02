import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeagueLeaderboard } from "../components/LeagueLeaderboard";
import { SummonerSearch } from "../components/SummonerSearch";

//página de estadísticas y acceso público (punto de entrada de la app)
export function Statistics() {
  return (
    <Tabs defaultValue="search" className="w-full max-w-5xl mx-auto px-4 py-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="search">Summoner Search</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>

      <TabsContent value="search">
        <SummonerSearch />
      </TabsContent>

      <TabsContent value="leaderboard">
        <LeagueLeaderboard />
      </TabsContent>
    </Tabs>
  );
}
