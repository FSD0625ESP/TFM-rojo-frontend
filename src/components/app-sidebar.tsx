import * as React from "react";
import { PowerOff } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Teams",
          url: "#",
        },
        {
          title: "Match",
          url: "#",
        },
        {
          title: "Chat",
          url: "#",
        },
        {
          title: "Statistics",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Explore Players",
          url: "#",
        },
        {
          title: "Global Chat",
          url: "#",
        },
        {
          title: "Private Messages",
          url: "#",
        },
        {
          title: "Forums & Groups",
          url: "#",
        },
        {
          title: "Top Players",
          url: "#",
        },
        {
          title: "Match History",
          url: "#",
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      items: [
        {
          title: "My Profile",
          url: "#",
        },
        {
          title: "My Team",
          url: "#",
        },
        {
          title: "My Stats",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
        {
          title: "Connect to LoL",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xl" asChild>
              <Link to="/">
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div> */}
                <div className="flex items-center justify-center">
                  <img src="./logo.png" alt="Logo LOL Match" className="h-12" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-3xl">LOL MATCH</span>
                  <span className="">Don&apos;t fight alone.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                to="/login"
                className="flex justify-center items-center gap-2"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PowerOff className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-xl">Logout</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
