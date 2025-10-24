import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { User, Settings, LogOut, LogIn } from "lucide-react";
import { handleLogout } from "../utils/session";
import { useNavigate } from "react-router-dom";

//bianvenida en header y mini menú de usuario
export function NavDropdown({ user, isAuthenticated, logout }) {
  const navigate = useNavigate();

  //cierra sesión y redirige a ruta pública
  const handleClick = async () => {
    await handleLogout({ logout, navigate, redirectTo: "/start/statistics" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition focus:outline-none focus-visible:ring-0"
          title={`Rol: ${user?.role || "user"}`}
        >
          <span>
            Welcome,{" "}
            <span className="text-primary">
              {isAuthenticated && user?.fullName ? user.fullName : "guest user"}
            </span>
          </span>
          <img
            src={user?.avatarUrl || "/default-avatar.png"}
            alt="Avatar"
            className={`w-8 h-8 rounded-full border-2 p-1 ${user?.isPremium ? "border-yellow-500" : "border-gray-300"
              }`}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile/my-profile" className="flex items-center gap-2">
                <User className="size-4" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile/my-settings" className="flex items-center gap-2">
                <Settings className="size-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="size-4" />
              Login
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
