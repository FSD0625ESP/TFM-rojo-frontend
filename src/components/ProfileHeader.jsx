import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Camera,
  Calendar,
  Mail,
  MapPin,
  Trophy,
  Flame,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { IMG_DEFAULT } from "../constants/images";

export function ProfileHeader() {
  const { user } = useAuth();

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.avatar || IMG_DEFAULT.avatar.src}
                alt="avatar"
              />
              <AvatarFallback className="text-2xl">JD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{user?.userName}</h1>
              <Badge variant="secondary">
                {user?.role !== "user" ? "Admin" : ""} Summoner
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {user?.lolProfile?.gameName && user?.lolProfile?.tagLine
                ? `${user?.lolProfile?.gameName} ${user?.lolProfile?.tagLine}`
                : "Game name + #Tag"}
            </p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="size-4" />
                Tier:{" "}
                {user?.lolProfile?.ranks
                  ? `${user?.lolProfile?.ranks} ${user?.lolProfile?.tier}`
                  : "Iron I"}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="size-4" />
                Role:{" "}
                {user?.lolProfile?.roleLol ? user?.lolProfile?.roleLol : "None"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Region:{" "}
                {user?.lolProfile?.region ? user?.lolProfile?.region : "EUW"}
              </div>
            </div>
          </div>
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
