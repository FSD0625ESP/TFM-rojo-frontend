import { useState } from "react";
import { useNavigate } from "react-router-dom";

//hook personalizado para manejar logout con feedback visual mediante un modal
export function useLogoutWithModal(redirectTo = "/login") {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const navigate = useNavigate();

  //función que ejecuta el logout y muestra el modal correspondiente
  const logoutWithFeedback = async (logoutFn) => {
    try {
      await logoutFn(); //ejecuta la función de cierre de sesión

      //si el logout fue exitoso, muestra mensaje de éxito
      setModalContent({
        title: "Sesión cerrada", //título del modal
        message:
          "Tu sesión se ha cerrado correctamente. Algunas funciones ya no estarán disponibles.",
        variant: "success",
        actions: [
          {
            label: "Continuar",
            onClick: () => {
              setModalOpen(false);
              navigate(redirectTo);
            },
          },
        ],
      });
    } catch (err) {
      console.error("Error logging out:", err.message);

      //si el logout falla, muestra mensaje de error
      setModalContent({
        title: "Error al cerrar sesión",
        message: "Ocurrió un problema al cerrar tu sesión. Intenta nuevamente.",
        variant: "error",
        actions: [
          {
            label: "Cerrar",
            onClick: () => setModalOpen(false),
          },
        ],
      });
    }

    setModalOpen(true);
  };

  return {
    modalOpen,
    modalContent,
    setModalOpen,
    logoutWithFeedback,
  };
}
