import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { LeagueLeaderboard } from "../components/LeagueLeaderboard";
import { SummonerSearch } from "../components/SummonerSearch";
import { ChampionStats } from "../components/ChampionStats";
import { ResponsiveTabsNav } from "../components/ResponsiveTabsNav";

//página de estadísticas y acceso público (punto de entrada de la app)
export function Statistics() {
  const [activeTab, setActiveTab] = useState("champions");
  const tabItems = [
    { label: "Champions Stats", value: "champions", private: false },
    { label: "Summoner Search", value: "search", private: false },
    //{ label: "Leaderboard", value: "leaderboard", private: false },
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full md:p-4"
    >
      {/* Header: navegación adaptable */}
      <ResponsiveTabsNav
        items={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}
        navigateToRoute={false}
        basePath=""
        tabListClassName="grid w-full sm:grid-cols-2 h-full"
      />

      {/* Content */}
      <TabsContent value="champions">
        <ChampionStats />
      </TabsContent>

      <TabsContent value="search">
        <SummonerSearch />
      </TabsContent>

      {/* <TabsContent value="leaderboard">
        <LeagueLeaderboard />
      </TabsContent> */}
    </Tabs>
  );
}
