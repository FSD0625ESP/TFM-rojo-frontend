import { Home, User } from "lucide-react";

export const NAV_MAIN = [
  {
    title: "Start",
    Icon: Home,
    url: "/start/statistics",
    items: [
      { title: "Global Stats", url: "/start/statistics" },
      { title: "Squads", url: "/start/squads" },
      { title: "GG Match", url: "/start/matches" },
      { title: "Community", url: "/start/community" },
    ],
  },
  {
    title: "Profile",
    Icon: User,
    url: "/profile/my-profile",
    items: [
      { title: "My Profile", url: "/profile/my-profile" },
      { title: "My Squad", url: "/profile/my-squad" },
      { title: "My Stats", url: "/profile/my-stats" },
      { title: "Settings", url: "/profile/my-settings" },
    ],
  },
];
