import { toast } from "sonner";

//función de cierre de sesión para botones logout
export const handleLogout = async ({
  logout,
  navigate,
  redirectTo = "/login",
}) => {
  try {
    await logout();
    toast.success("Session successfully closed ✅");
    navigate(redirectTo);
  } catch (err) {
    console.error("Error logging out:", err.message);
    toast.error("Error logging out ❌");
  }
};
