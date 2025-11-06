import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_MAIN } from "../constants/navigation";
import { AppSidebarSection } from "./AppSidebarSection";
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
import { Card, CardContent } from "./ui/card";
import { IMG_DEFAULT } from "../constants/images";

//no se llama sidebar solo, para no confundir con el sidebar de shadcn
//barra lateral con menú completo desplegable
export function AppSidebar(props) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState({ Start: true });

  const toggleExpand = (sectionTitle) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // acción condicional según estado de sesión
  const handleSessionClick = async () => {
    if (isAuthenticated) {
      await handleLogout({ logout, navigate, redirectTo: "/start/statistics" });
    } else {
      navigate("/login");
    }
  };

  const sessionIcon = isAuthenticated ? (
    <LogOut className="size-4" />
  ) : (
    <LogIn className="size-4" />
  );
  const sessionLabel = isAuthenticated ? "Logout" : "Login";
  const navMain = NAV_MAIN;

  return (
    <Sidebar {...props}>
      {/* header con logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="xl" asChild>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={IMG_DEFAULT.logo.src}
                  alt={IMG_DEFAULT.logo.alt}
                  className="h-12"
                />
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
              <AppSidebarSection
                key={section.title}
                section={section}
                expanded={expanded}
                toggleExpand={toggleExpand}
                location={location}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />

      {/* footer con login/logout */}
      <SidebarFooter>
        <SidebarMenu>
          <Card className="rounded-sm py-0 center">
            <CardContent className="px-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  onClick={handleSessionClick}
                  className="flex justify-start items-center gap-2 cursor-pointer"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded-lg">
                    {sessionIcon}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-lg">
                      {sessionLabel}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </CardContent>
          </Card>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
