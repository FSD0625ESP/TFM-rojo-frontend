import { toast } from "sonner";

//función de cierre de sesión para botones logout
export const handleLogout = async ({ logout, navigate, redirectTo = "/login" }) => {
    try {
        await logout();
        toast.success("Sesión cerrada correctamente ✅");
        navigate(redirectTo);
    } catch (err) {
        console.error("Error al cerrar sesión:", err.message);
        toast.error("Error al cerrar sesión ❌");
    }
};
