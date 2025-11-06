import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NAV_MAIN } from "../constants/navigation";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

//componente reutilizable para navegación por sección (Start, Profile, etc.)
export function SectionNav({ sectionTitle, defaultRoute }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  //detectar si es móvil
  const isMobile = useMediaQuery({ maxWidth: 639 });

  // extraer los items de la sección correspondiente desde NAV_MAIN
  const section = NAV_MAIN.find((s) => s.title === sectionTitle);
  const buttons =
    section?.items.map(({ title, url, private: isPrivate }) => {
      const key = url.split("/")[2]; //extrae el segmento clave de la URL
      return { label: title, key, isPrivate };
    }) || [];

  //detectar ruta activa desde la URL
  const activeComponent = location.pathname.split("/")[2] || defaultRoute;
  const [activeTab, setActiveTab] = useState(activeComponent);

  //sincronizar el estado con la URL
  useEffect(() => {
    setActiveTab(activeComponent);
  }, [activeComponent]);

  //manejar cambio de selección
  const handleSelectChange = (value) => {
    setActiveTab(value);
    navigate(`/${sectionTitle.toLowerCase()}/${value}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-full w-full max-w-screen-lg mx-auto">
      {/* Navegación superior */}
      {isMobile ? (
        <div className="w-full max-w-full">
          <Select value={activeTab} onValueChange={handleSelectChange}>
            <SelectTrigger className="bg-primary text-background p-6 text-xl font-bold w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {buttons.map(({ label, key, isPrivate }) => {
                //desactiva si el enlace es privado y el usuario no está logueado
                const isDisabled = isPrivate && !isAuthenticated;
                return (
                  <SelectItem
                    key={key}
                    value={key}
                    disabled={isDisabled}
                    title={isDisabled ? "Login required" : undefined} // <-- tooltip
                  >
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
          {buttons.map(({ label, key, isPrivate }) => {
            //desactiva si no hay sesión o el enlace es privado
            const isDisabled = isPrivate && !isAuthenticated;
            return (
              <button
                key={key}
                onClick={() =>
                  !isDisabled &&
                  navigate(`/${sectionTitle.toLowerCase()}/${key}`)
                }
                className={`w-full py-2 rounded-lg text-lg font-medium transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed text-muted-foreground opacity-50"
                    : "cursor-pointer"
                } ${
                  activeComponent === key && !isDisabled
                    ? "bg-primary text-primary-foreground"
                    : !isDisabled
                    ? "bg-muted text-muted-foreground hover:bg-muted/70"
                    : "bg-muted"
                }`}
                title={isDisabled ? "Login required" : undefined} // <-- tooltip
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenido central renderizado por React Router */}
      <div className="flex flex-1 rounded-xl md:bg-muted/50 bg-background overflow-auto h-full">
        <div className="flex flex-1 w-full h-full items-start justify-center md:p-2 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
