import { useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import { authReducer, initialAuthState } from "../context/authReducer";
import { useLocation } from "react-router-dom";
import { clearAuthCookies } from "../utils/authInterceptor";

//este custom hook sirve para el AuthContext
//se encarga de verificar si hay sesión activa al montar la app
//lee la cookie userData y luego consulta el backend /auth/check
export function useSessionCheck(API_URL) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const location = useLocation();
  const skipSessionCheck =
    location.pathname.startsWith("/verify-account") ||
    location.pathname.startsWith("/reset-password");

  useEffect(() => {
    //si ingreso el token para verificar la cuenta, no hace falta
    //comprobar que estoy conectado
    if (skipSessionCheck) return;

    const checkSession = async () => {
      dispatch({ type: "CHECK_SESSION_START" });

      const cookie = Cookies.get("userData");
      if (cookie) {
        try {
          const parsed = JSON.parse(cookie);
          dispatch({ type: "CHECK_SESSION_SUCCESS", payload: parsed });
        } catch {
          Cookies.remove("userData");
        }
      }

      try {
        const res = await fetch(`${API_URL}/auth/check`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          Cookies.set("userData", JSON.stringify(data.user), { expires: 7 });
          dispatch({ type: "CHECK_SESSION_SUCCESS", payload: data.user });
        } else if (res.status === 401) {
          //si recibimos 401, limpiar todas las cookies de autenticación
          //esto puede ocurrir cuando se cambia de dominio o la sesión expira
          clearAuthCookies();
          dispatch({ type: "CHECK_SESSION_FAILURE" });
        } else {
          //otros errores (500, 404, etc.)
          Cookies.remove("userData");
          dispatch({ type: "CHECK_SESSION_FAILURE" });
        }
      } catch (error) {
        //en caso de error de red, mantener el estado actual si hay cookie
        //pero si no hay cookie, marcar como no autenticado
        if (!cookie) {
          clearAuthCookies();
          dispatch({ type: "CHECK_SESSION_FAILURE" });
        } else {
          //si hay cookie pero falla la red, mantener el estado optimista
          //el usuario seguirá autenticado hasta que se resuelva la conexión
          dispatch({ type: "CHECK_SESSION_FAILURE" });
        }
      }
    };


    checkSession();
  }, [API_URL, skipSessionCheck]);

  return {
    ...state,
    dispatch, //expone el dispatch para login/logout
  };

}
