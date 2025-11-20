import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { User, Settings, LogOut, LogIn, Bell, MessageCircle } from "lucide-react";
import { handleLogout } from "../utils/session";
import { useNavigate } from "react-router-dom";
import { IMG_DEFAULT } from "../constants/images";
import { useNotifications } from "../context/NotificationContext";
import { useChat } from "../context/ChatContext";
import { NotificationPanel } from "./NotificationPanel";

//bianvenida en header y mini menú de usuario
export function NavDropdown({ user, isAuthenticated, logout }) {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { conversations } = useChat();
  const [showNotifications, setShowNotifications] = useState(false);

  //calcular total de mensajes no leídos de chats privados
  const totalUnreadChats = conversations.reduce((total, conv) => {
    return total + (conv.unreadCount || 0);
  }, 0);

  //cierra sesión y redirige a ruta pública
  const handleClick = async () => {
    await handleLogout({ logout, navigate, redirectTo: "/start/statistics" });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition focus:outline-none focus-visible:ring-0 relative"
            title={`Role: ${user?.role || "user"}`}
          >
            <span>
              Welcome,{" "}
              <span className="text-primary">
                {isAuthenticated && user?.userName ? user.userName : "guest user"}
              </span>
            </span>
            <div className="relative">
              <img
                src={user?.avatar || IMG_DEFAULT.avatarGuest.src}
                alt="Avatar"
                className={`w-8 h-8 rounded-full border-2 p-1 ${user?.preferences?.isPremium
                  ? "border-yellow-500"
                  : "border-gray-300"
                  }`}
              />
              {isAuthenticated && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-background">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {isAuthenticated && totalUnreadChats > 0 && (
                <span className="absolute -bottom-1 -left-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-blue-500 rounded-full border-2 border-background">
                  {totalUnreadChats > 99 ? "99+" : totalUnreadChats}
                </span>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {isAuthenticated ? (
            <>
              <DropdownMenuItem
                onClick={() => setShowNotifications(true)}
                className="flex items-center gap-2 relative"
              >
                <Bell className="size-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/start/community?tab=chats")}
                className="flex items-center gap-2 relative"
              >
                <MessageCircle className="size-4" />
                Chats
                {totalUnreadChats > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {totalUnreadChats > 99 ? "99+" : totalUnreadChats}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile/my-profile"
                  className="flex items-center gap-2"
                >
                  <User className="size-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/profile/my-settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleClick}
                className="flex items-center gap-2"
              >
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

      {isAuthenticated && (
        <NotificationPanel
          open={showNotifications}
          onOpenChange={setShowNotifications}
        />
      )}
    </>
  );
}
