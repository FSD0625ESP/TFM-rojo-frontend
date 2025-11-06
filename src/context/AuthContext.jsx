import { createContext, useContext } from "react";
import Cookies from "js-cookie";
import { useSessionCheck } from "../hooks/useSessionCheck";
import { loginUser, logoutUser } from "../services/authService";
import { IMG_DEFAULT } from "../constants/images";

//crear el contexto de autenticación
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

//provider para envolver todo en main.jsx
export function AuthProvider({ children }) {
  const { user, isAuthenticated, loading, dispatch } = useSessionCheck(API_URL);
  //console.log(user); // <--- ver el objeto user que recibimos

  //función para iniciar sesión
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      Cookies.set("userData", JSON.stringify(data.user), { expires: 1 / 24 });

      //actualiza el estado del contexto inmediatamente
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });

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
      Cookies.remove("userData");

      //actualiza el estado del contexto inmediatamente
      dispatch({ type: "LOGOUT" });
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

//custom hook para usar en otros componentes
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
