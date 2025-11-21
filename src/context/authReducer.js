export const initialAuthState = {
  user: null, //datos del usuario
  isAuthenticated: false, //indica si hay sesión activa
  loading: true, //indica si se está verificando la sesión
  //roles: [], //lista de roles del usuario (admin, player, coach, etc.)
  //isPremium: false, //indica si el usuario tiene cuenta premium
  //token: null, //token JWT o de sesión si lo usás
  //error: null, //mensaje de error si ocurre algo
};

export function authReducer(state, action) {
  switch (action.type) {
    case "CHECK_SESSION_START":
      //inicia la verificación de sesión y activa el estado de carga
      return { ...state, loading: true };

    case "CHECK_SESSION_SUCCESS":
      //la sesión es válida, se actualiza el usuario y se marca como autenticado
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "CHECK_SESSION_FAILURE":
      //la sesión no es válida o falló, se limpia el usuario y se desactiva la autenticación
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };

    case "LOGIN_SUCCESS":
      //el login fue exitoso, se guarda el usuario y se activa la autenticación
      return {
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      //el usuario cerró sesión, se limpia el estado de autenticación
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      //acción desconocida, se retorna el estado actual sin cambios
      return state;
  }
}
