import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "../ui/tabs";
import { ResponsiveTabsNav } from "../ResponsiveTabsNav";
import { StartGGMatchSummoners } from "./StartGGMatchSummoners";
import { StartGGMatchMyMatches } from "./StartGGMatchMyMatches";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

//componente para el GG Match con drag and drop y animaciones
export function StartGGMatchContent() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("summoners");
  const [matches, setMatches] = useState([]);

  //cargar matches desde el usuario al montar el componente y cuando cambie el usuario
  useEffect(() => {
    if (isAuthenticated && user?.matches) {
      //asegurar que siempre usamos el formato correcto desde el backend
      setMatches(user.matches);
    } else if (!isAuthenticated) {
      //limpiar matches si el usuario no está autenticado
      setMatches([]);
    }
  }, [isAuthenticated, user, user?.matches]);

  const tabItems = [
    { label: "Summoners", value: "summoners", private: false },
    { label: "My Matches", value: "matches", private: false },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <ResponsiveTabsNav
        items={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}
        navigateToRoute={false}
        basePath=""
        tabListClassName="grid w-full grid-cols-[1fr_1fr] sm:grid-cols-2 h-full sm:mb-2"
      />

      {/* Summoners Tab */}
      <TabsContent value="summoners" className="space-y-4">
        <StartGGMatchSummoners
          matches={matches}
          setMatches={setMatches}
          setActiveTab={setActiveTab}
        />
      </TabsContent>

      {/* My Matches Tab */}
      <TabsContent value="matches" className="space-y-4">
        <StartGGMatchMyMatches matches={matches} setMatches={setMatches} />
      </TabsContent>
    </Tabs>
  );
}

