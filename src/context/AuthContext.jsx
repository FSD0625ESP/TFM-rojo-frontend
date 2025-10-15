import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../services/authService.js";
import Cookies from "js-cookie";

//crear el contexto de autenticación
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

//función proveedora para usar en main.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  //verificar si el usuario ha iniciado sesión
  useEffect(() => {
    const checkSession = async () => {
      //verificar si hay datos de usuario en cookies locales
      const userDataCookie = Cookies.get("userData");
      if (userDataCookie) {
        try {
          const userData = JSON.parse(userDataCookie);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);

          //verificar si la sesión sigue siendo válida
          try {
            const res = await fetch(`${API_URL}/auth/check`, {
              method: "GET",
              credentials: "include",
            });
            if (res.ok) {
              const data = await res.json();
              //actualizar datos si han cambiado
              Cookies.set("userData", JSON.stringify(data.user), {
                expires: 7,
              }); // 7 días
              setUser(data.user);
            } else {
              //si la sesión es inválida, limpiar estado
              Cookies.remove("userData");
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (err) {
            //error en verificación, pero mantener datos locales por ahora
            //no mostrar error en consola si es un error de red esperado (es molesto verlo en consola)
          }
          return;
        } catch (err) {
          //error parseando cookie, limpiarla
          Cookies.remove("userData");
        }
      }

      //no hay datos locales, verificar con el servidor
      try {
        const res = await fetch(`${API_URL}/auth/check`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
          Cookies.set("userData", JSON.stringify(data.user), {
            expires: 7,
          }); // 7 días
        } else {
          //no hay sesión activa - limpiar estado local (no mostrar error 401 en consola)
          Cookies.remove("userData");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        //error de red, no mostrar en consola si es esperado
        Cookies.remove("userData");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  //función para iniciar sesión
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      Cookies.set("userData", JSON.stringify(data.user), { expires: 1 / 24 }); // 7 días
      return { success: true };
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      return { success: false, message: err.message };
    }
  };

  //función para cerrar sesión
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove("userData");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//función para usar el contexto en otros componentes
export const useAuth = () => useContext(AuthContext);
