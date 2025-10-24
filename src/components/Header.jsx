import { useLocation } from "react-router-dom";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { BreadcrumbNav } from "../components/BreadcrumNav";
import { NavDropdown } from "../components/NavDropdown";

//header con trigger del sidebar, breadcrumbs y navdropdown
export function Header() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3 w-full justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <BreadcrumbNav pathSegments={pathSegments} />
        </div>
        <NavDropdown user={user} isAuthenticated={isAuthenticated} logout={logout} />
      </div>
    </header>
  );
}

