import { useState } from "react";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const publicSquads = [
  {
    name: "Night Howlers",
    members: 5,
    tier: "Platinum",
    description: "Aggressive jungle-focused team",
  },
  {
    name: "Arcane Order",
    members: 4,
    tier: "Diamond",
    description: "Midlane control and macro play",
  },
  {
    name: "Sunfire Legion",
    members: 3,
    tier: "Gold",
    description: "Friendly and casual team",
  },
  {
    name: "Stormbreakers",
    members: 5,
    tier: "Platinum",
    description: "Aggressive jungle-focused team",
  },
];

export function StartSquadContent({ onSelectSquad }) {
  const [search, setSearch] = useState("");

  const filteredSquads = publicSquads.filter((squad) =>
    squad.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold">Search Squads</h2>
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm border-2 border-muted-foreground"
          variant="outlined"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSquads.map((squad, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{squad.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {squad.description}
              </p>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-sm">
                <p>Miembros: {squad.members}</p>
                <p>Tier: {squad.tier}</p>
              </div>
              <Button size="sm" onClick={() => onSelectSquad(squad)}>
                Ver
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
