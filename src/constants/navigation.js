import { Home, User } from "lucide-react";

export const NAV_MAIN = [
    {
      title: "Start",
      Icon: Home,
      url: "/start/statistics",
      items: [
        { title: "Statistics", url: "/start/statistics" },
        { title: "Teams", url: "/start/teams" },
        { title: "Match", url: "/start/matchs" },
        { title: "Chat", url: "/start/chats" },
      ],
    },
    {
      title: "Profile",
      Icon: User,
      url: "/profile/my-profile",
      items: [
        { title: "My Profile", url: "/profile/my-profile" },
        { title: "My Team", url: "/profile/my-team" },
        { title: "My Stats", url: "/profile/my-stats" },
        { title: "Settings", url: "/profile/my-settings" },
      ],
    },
  ];
  