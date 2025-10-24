import { Link } from "react-router-dom";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "../components/ui/sidebar";

//sirve para mostrar el menú desplegable con los enlaces en AppSidebar
export function SidebarSection({ section, expanded, toggleExpand, location }) {
  const isActive = location.pathname.startsWith(section.url);
  const { Icon } = section;

  return (
    <SidebarMenuItem key={section.title}>
      <SidebarMenuButton
        onClick={() => toggleExpand(section.title)}
        className={`font-medium flex items-center gap-2 w-full ${isActive ? "text-primary font-semibold" : ""
          }`}
      >
        <Icon className="size-4" />
        {section.title}
      </SidebarMenuButton>

      {expanded === section.title && section.items?.length > 0 && (
        <SidebarMenuSub>
          {section.items.map((item) => (
            <SidebarMenuSubItem key={item.title}>
              <SidebarMenuSubButton asChild>
                <Link
                  to={item.url}
                  className={`${location.pathname === item.url
                    ? "text-primary font-semibold"
                    : ""
                    }`}
                >
                  {item.title}
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
