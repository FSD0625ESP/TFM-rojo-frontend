import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { ResponsiveTabsNav } from "./ResponsiveTabsNav";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";

// Datos simulados
const chatRooms = [
  { name: "Barcelona Gamers", region: "Cataluña", members: 120 },
  { name: "Madrid Arena", region: "Madrid", members: 85 },
  { name: "Andalucía Legends", region: "Andalucía", members: 60 },
  { name: "Global Strategy", region: "Internacional", members: 200 },
];

const userChats = [
  {
    contact: "ShadowBlade",
    lastMessage: "Nos vemos en la partida",
    timestamp: "Hace 2h",
  },
  { contact: "ArcaneSoul", lastMessage: "¿Jugamos ranked?", timestamp: "Ayer" },
  {
    contact: "MysticFlame",
    lastMessage: "Buen trabajo en el torneo",
    timestamp: "Hace 3 días",
  },
];

export function StartCommunityContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("channels");
  const [regionSearch, setRegionSearch] = useState("");

  const tabItems = [
    { label: "Channels", value: "channels", private: false },
    { label: "Chats", value: "chats", private: false },
  ];

  const filteredRooms = chatRooms.filter((room) =>
    room.region.toLowerCase().includes(regionSearch.toLowerCase())
  );

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

      {/* 🟦 Channels Tab */}
      <TabsContent value="channels" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Salas de Comunicación</CardTitle>
            <CardDescription>
              Explora canales por región y únete a comunidades activas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              placeholder="Buscar por región..."
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              className="max-w-sm border border-gray-300 bg-white text-black px-3 py-2 rounded-md"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRooms.map((room, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Región: {room.region}
                    </p>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Badge variant="outline">{room.members} miembros</Badge>
                    <Button size="sm">Entrar</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 🟩 Chats Tab */}
      <TabsContent value="chats" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Mis Chats</CardTitle>
            <CardDescription>
              Conversaciones con tus contactos personales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userChats.map((chat, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{chat.contact}</p>
                  <p className="text-sm text-muted-foreground">
                    {chat.lastMessage}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {chat.timestamp}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
