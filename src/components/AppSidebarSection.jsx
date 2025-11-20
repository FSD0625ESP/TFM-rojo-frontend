import { Link } from "react-router-dom";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "../components/ui/sidebar";

//sirve para mostrar el menú desplegable con los enlaces en AppSidebar
export function AppSidebarSection({
  section,
  expanded,
  toggleExpand,
  location,
  isAuthenticated,
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = location.pathname.startsWith(section.url);
  const { Icon } = section;

  // Cerrar el sidebar en móvil/tablet cuando se hace clic en un enlace
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem key={section.title}>
      <SidebarMenuButton
        onClick={() => toggleExpand(section.title)}
        className={`font-medium flex items-center gap-2 w-full ${
          isActive ? "text-primary font-semibold" : ""
        }`}
      >
        <Icon className="size-4" />
        {section.title}
      </SidebarMenuButton>

      {expanded?.[section.title] && section.items?.length > 0 && (
        <SidebarMenuSub>
          {section.items.map((item) => {
            const isPrivate = item.private;
            //desactiva si el enlace es privado y el usuario no está logueado
            const isDisabled = isPrivate && !isAuthenticated;

            return (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild>
                  {isDisabled ? (
                    // si el enlace es privado y el usuario no está logueado, se muestra desactivado
                    <span
                      className="text-muted-foreground cursor-not-allowed opacity-50"
                      title="Login required" // <-- tooltip en el navegador
                    >
                      {item.title}
                    </span>
                  ) : (
                    // si el enlace está activo, se muestra como Link normal
                    <Link
                      to={item.url}
                      onClick={handleLinkClick}
                      className={`${
                        location.pathname === item.url
                          ? "text-primary font-semibold"
                          : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
