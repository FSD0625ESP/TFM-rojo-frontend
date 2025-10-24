import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Aquí se renderiza login, register, etc */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
