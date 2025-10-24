import { useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import { authReducer, initialAuthState } from "../context/authReducer";

//este custom hook sirve para el AuthContext
export function useSessionCheck(API_URL) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
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
        } else {
          Cookies.remove("userData");
          dispatch({ type: "CHECK_SESSION_FAILURE" });
        }
      } catch {
        dispatch({ type: "CHECK_SESSION_FAILURE" });
      }
    };

    checkSession();
  }, [API_URL]);

  return {
    ...state,
    dispatch, //expone el dispatch para login/logout
  };
}
