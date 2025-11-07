import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
} from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";

export function ProfileStatsContent() {
  const { user } = useAuth();

  return (
    <Tabs defaultValue="summoner">
      {/* Summoner Information */}
      <TabsContent value="summoner" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Summoner</CardTitle>
            <CardDescription>
              Power information and your summoner's data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="champion">Most Played Champion</Label>
                <Input
                  className="bg-muted"
                  id="champion"
                  defaultValue={user?.lolStats?.champion || ""}
                  readOnly
                  placeholder="Aatrox"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="winRate">Win Rate</Label>
                <Input
                  className="bg-muted"
                  id="winRate"
                  defaultValue={user?.lolStats?.winRate || ""}
                  readOnly
                  placeholder="50%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  className="bg-muted"
                  id="matchesPlayed"
                  defaultValue={user?.lolStats?.matchesPlayed || ""}
                  readOnly
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kills">Kills</Label>
                <Input
                  id="kills"
                  defaultValue={user?.lolStats?.kills || ""}
                  className="bg-muted"
                  readOnly
                  placeholder="65%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deaths">Deaths</Label>
                <Input
                  className="bg-muted"
                  id="deaths"
                  defaultValue={user?.lolStats?.deaths || ""}
                  readOnly
                  placeholder="25%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Assists</Label>
                <Input
                  className="bg-muted"
                  id="assists"
                  defaultValue={user?.lolStats?.assists || ""}
                  readOnly
                  placeholder="45%"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="queue">Queue</Label>
                <Input
                  className="bg-muted"
                  id="queue"
                  defaultValue={user?.lolProfile?.queue || ""}
                  readOnly
                  placeholder="Ranked Flex 5v5"
                />
              </div>
              <Label htmlFor="mySquad">My Squad</Label>
              <Input
                className="bg-muted"
                id="mySquad"
                defaultValue={user?.lolProfile?.mySquad || ""}
                readOnly
                placeholder="Nexxus Squad"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
