import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { IMG_DEFAULT, IMG_ROLES } from "../constants/images.js";

// Colores de borde por rol
const ROLE_BORDER = {
  top: "border-purple-700",
  jungle: "border-green-700",
  mid: "border-blue-700",
  adc: "border-red-700",
  support: "border-yellow-500",
};

const squadMembers = [
  {
    name: "ShadowBlade",
    tier: "Diamond IV",
    honor: "Great teammate",
    role: "top",
    avatar: IMG_DEFAULT.avatar.src,
  },
  {
    name: "WildFang",
    tier: "Platinum I",
    honor: "Shotcaller",
    role: "jungle",
    avatar: IMG_DEFAULT.avatarGuest.src,
  },
  {
    name: "ArcaneSoul",
    tier: "Emerald II",
    honor: "Friendly",
    role: "mid",
    avatar: IMG_DEFAULT.avatar.src,
  },
  {
    name: "CrimsonArrow",
    tier: "Gold I",
    honor: "Strategist",
    role: "adc",
    avatar: IMG_DEFAULT.avatarGuest.src,
  },
];

export function ProfileSquadContent() {
  const { user } = useAuth();

  const renderCard = (member, index) => {
    const roleIcon = IMG_ROLES[member.role] || {
      src: IMG_DEFAULT.profileIcon.src,
      alt: "default-role",
    };

    const borderColor = ROLE_BORDER[member.role] || "border-gray-600";

    return (
      <Card
        key={index}
        className={`shadow-md overflow-hidden border-4 ${borderColor} bg-neutral-900 text-white`}
      >
        <CardHeader className="flex flex-wrap items-start gap-4">
          <img
            src={member.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-white object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl truncate">{member.name}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary">{member.tier}</Badge>
              <Badge variant="outline">{member.honor}</Badge>
            </div>
          </div>
          <img
            src={roleIcon.src}
            alt={roleIcon.alt}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
        </CardHeader>
        <CardContent>
          <p className="text-sm">Role: {member.role?.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  };

  const myProfile = {
    name: user?.contact?.name || "My Profile",
    tier: user?.rank?.tier || "Master",
    honor: user?.honor || "Leader",
    role: user?.role || "support",
    avatar: user?.avatar || IMG_DEFAULT.profileIcon.src,
  };

  return (
    <div className="space-y-4">
      {/* Mi perfil */}
      {renderCard(myProfile, "me")}

      {/* Otros miembros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {squadMembers.map((member, index) => renderCard(member, index))}
      </div>
    </div>
  );
}
