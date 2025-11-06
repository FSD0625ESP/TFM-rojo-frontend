import { useMediaQuery } from "react-responsive";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

//función para navegación adaptable (tabs en desktop, select en móvil)
//admite control de acceso con `private: true` y tooltips
//permite navegación opcional por rutas o dentro del componente
export function ResponsiveTabsNav({
  items,
  activeTab,
  onChange,
  navigateToRoute = false, // si es true, navega con react-router
  basePath = "", // ruta base si se usa navegación por rutas
  tabListClassName = "", // clase por defecto
}) {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (value) => {
    if (navigateToRoute) {
      navigate(`${basePath}/${value}`);
    } else {
      onChange(value);
    }
  };

  return isMobile ? (
    // versión móvil: menú desplegable
    <div className="flex-grow min-w-[150px] max-w-full mb-2">
      <Select value={activeTab} onValueChange={handleChange}>
        <SelectTrigger className="bg-muted p-6 text-xl font-medium w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => {
            const { label, value } = item;
            const isDisabled = item.private && !isAuthenticated;
            return (
              <SelectItem
                key={value}
                value={value}
                disabled={isDisabled}
                title={isDisabled ? "Login required" : undefined}
              >
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  ) : (
    // versión escritorio: tabs horizontales
    <TabsList className={tabListClassName}>
      {items.map((item) => {
        const { label, value } = item;
        const isDisabled = item.private && !isAuthenticated;
        return (
          <TabsTrigger
            key={value}
            value={value}
            disabled={isDisabled}
            title={isDisabled ? "Login required" : undefined}
            onClick={() => !isDisabled && handleChange(value)}
            className={isDisabled ? "cursor-not-allowed opacity-50 p-2" : "p-2"}
          >
            {label}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
