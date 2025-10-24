import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertModal } from "./AlertModal";

//componente que protege rutas privadas (muestra un modal)
export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //referencia para guardar el id del timeout de redirección
  //esto sirve para que no espere los 5 seg para redireccionar
  const redirectTimer = useRef(null);

  //función para limpiar el timeout de redirección
  const clearRedirect = useCallback(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }
  }, []);

  //función para redirigir a una ruta específica y cerrar el modal
  const redirectTo = useCallback((path) => {
    clearRedirect();
    setShowModal(false);
    navigate(path, { replace: true });
  }, [navigate, clearRedirect]);

  //efecto que se ejecuta cuando cambia el estado de autenticación
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowModal(true);
      redirectTimer.current = setTimeout(() => {
        redirectTo("/start/statistics");
      }, 5000);
    }

    //limpiar el timeout si el componente se desmonta
    return () => clearRedirect();
  }, [loading, isAuthenticated, redirectTo, clearRedirect]);

  //función para cerrar el modal y redirigir al área pública
  const handleClose = () => redirectTo("/start/statistics");

  //función para ir a la página de login y guardar la ruta actual para volver después
  const handleGoToLogin = () =>
    navigate("/login", { state: { from: location.pathname }, replace: true });

  //mostrar spinner de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  //autenticado, renderizar children, sino mostrar modal
  return isAuthenticated ? (
    children
  ) : (
    <AlertModal
      open={showModal}
      onClose={handleClose}
      title="Summoners-only area"
      message="You are not logged in. To access this section, you must log in. We will redirect you to the public area."
      variant="warning"
      actions={[
        { label: "Close", onClick: handleClose, variant: "outline" },
        { label: "Login", onClick: handleGoToLogin },
      ]}
    />
  );
}
