import { Home, User } from "lucide-react";

export const NAV_MAIN = [
  {
    title: "Start",
    Icon: Home,
    url: "/start/statistics",
    items: [
      { title: "Global Stats", url: "/start/statistics", private: false },
      { title: "Squads", url: "/start/squads", private: true },
      { title: "GG Match", url: "/start/matches", private: true },
      { title: "Community", url: "/start/community", private: true },
    ],
  },
  {
    title: "Profile",
    Icon: User,
    url: "/profile/my-profile",
    items: [
      { title: "My Profile", url: "/profile/my-profile", private: true },
      { title: "My Squad", url: "/profile/my-squad", private: true },
      { title: "My Stats", url: "/profile/my-stats", private: true },
      { title: "Settings", url: "/profile/my-settings", private: true },
    ],
  },
];
