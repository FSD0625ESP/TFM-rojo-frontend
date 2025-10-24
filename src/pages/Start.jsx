import { Outlet, useNavigate, useLocation } from "react-router-dom";

export function Start() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { label: "Statistics", key: "statistics" },
    { label: "Teams", key: "teams" },
    { label: "Matchs", key: "matchs" },
    { label: "Chats", key: "chats" },
  ];

  // Detectar ruta activa desde la URL
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
        <div className="flex flex-1 w-full h-full items-start justify-center px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
