import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { IMG_DEFAULT, IMG_ROLES } from "../constants/images";

const ROLE_COLORS = {
  top: "border-purple-700",
  jungle: "border-green-700",
  mid: "border-blue-700",
  adc: "border-red-700",
  support: "border-yellow-500",
};

const players = [
  {
    name: "ShadowBlade",
    tier: "Diamond IV",
    honor: "Great teammate",
    role: "top",
    avatar: IMG_DEFAULT.avatar.src,
    likedByUser: false,
    likedUser: true,
  },
  {
    name: "WildFang",
    tier: "Platinum I",
    honor: "Shotcaller",
    role: "jungle",
    avatar: IMG_DEFAULT.avatarGuest.src,
    likedByUser: false,
    likedUser: false,
  },
  {
    name: "ArcaneSoul",
    tier: "Emerald II",
    honor: "Friendly",
    role: "mid",
    avatar: IMG_DEFAULT.avatar.src,
    likedByUser: false,
    likedUser: true,
  },
];

export function StartGGMatchContent() {
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState([]);

  const current = players[index];
  const roleColor = ROLE_COLORS[current.role] || "border-gray-500";

  const handleLike = () => {
    const updated = [...players];
    updated[index].likedByUser = true;

    if (updated[index].likedUser) {
      setMatches((prev) => [...prev, updated[index]]);
      alert(`🎉 ¡Match con ${updated[index].name}!`);
    }

    nextCard();
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % players.length);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">GG Match</h2>

      <div className="relative h-[400px]">
        <AnimatePresence>
          <motion.div
            key={current.name}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className={`absolute w-full h-full bg-neutral-900 rounded-xl p-6 border-4 ${roleColor} flex flex-col items-center justify-center text-white`}
          >
            <img
              src={current.avatar}
              alt={current.name}
              className="w-28 h-28 rounded-full border-4 border-white object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{current.name}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{current.tier}</Badge>
              <Badge variant="outline">{current.honor}</Badge>
            </div>
            <img
              src={IMG_ROLES[current.role]?.src || IMG_DEFAULT.profileIcon.src}
              alt={current.role}
              className="w-10 h-10 mt-4"
            />
            <p className="text-sm mt-1">Rol: {current.role.toUpperCase()}</p>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button variant="outline" size="sm" onClick={handleLike}>
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                Me gusta
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="ghost" onClick={nextCard}>
          Siguiente →
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-center text-green-400">
            🎯 Matches
          </h4>
          <ul className="mt-2 space-y-1 text-center text-sm text-white">
            {matches.map((m, i) => (
              <li key={i}>{m.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
