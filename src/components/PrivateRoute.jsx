import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

//función para proteger rutas privadas
export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  //mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
