import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_MAIN } from "../constants/navigation";
import { SidebarSection } from "./SidebarSection";
import { handleLogout } from "../utils/session";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "./ui/sidebar";

//no se llama sidebar solo, para no confundir con el sidebar de shadcn
//barra lateral con menú completo desplegable
export function AppSidebar(props) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState("Start");

  const toggleExpand = (sectionTitle) => {
    setExpanded((prev) => (prev === sectionTitle ? null : sectionTitle));
  };

  //cierra sesión y redirige a ruta pública
  const handleClick = async () => {
    await handleLogout({ logout, navigate, redirectTo: "/start/statistics" });
  };

  const sessionIcon = isAuthenticated
    ? <LogOut className="size-4" />
    : <LogIn className="size-4" />;
  const sessionLabel = isAuthenticated
    ? "Logout"
    : "Login";
  const navMain = NAV_MAIN;

  return (
    <Sidebar {...props}>
      {/* header con logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xl" asChild>
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo LOL Match" className="h-12" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-3xl">LOL MATCH</span>
                  <span>Don&apos;t fight alone.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* navegación */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((section) => (
              <SidebarSection
                key={section.title}
                section={section}
                expanded={expanded}
                toggleExpand={toggleExpand}
                location={location}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />

      {/* footer con login/logout */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={handleClick}
              className="flex justify-start items-center gap-2 cursor-pointer"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {sessionIcon}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-xl">{sessionLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
