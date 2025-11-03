import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { NAV_MAIN } from "../constants/navigation";

export function StartNav() {
  const navigate = useNavigate();
  const location = useLocation();

  //extraer los items de la sección "Start" desde NAV_MAIN
  const startSection = NAV_MAIN.find((section) => section.title === "Start");
  const buttons =
    startSection?.items.map(({ title, url }) => {
      const key = url.split("/")[2]; //extrae el segmento clave de la URL
      return { label: title, key };
    }) || [];

  //detectar ruta activa desde la URL
  const activeComponent = location.pathname.split("/")[2] || "statistics";

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-full">
      {/* Botones arriba */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {buttons.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => navigate(`${key}`)}
            className={`w-full py-2 rounded-lg text-lg font-medium transition-colors cursor-pointer ${
              activeComponent === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido central renderizado por React Router */}
      <div className="flex flex-1 rounded-xl bg-muted/50 overflow-auto h-full">
        <div className="flex flex-1 w-full h-full items-start justify-center px-2 py-2 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
