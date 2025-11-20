import { makeRequest } from "./apiService";
const API_URL = import.meta.env.VITE_API_URL;

//registro de usuario
export const registerUser = (data) =>
  makeRequest("/auth/register", "POST", data);
//login de usuario
export const loginUser = (data) => makeRequest("/auth/login", "POST", data);
//logout de usuario
export const logoutUser = () => makeRequest("/auth/logout", "POST");
//recuperar contraseña
export const forgotPassword = (data) =>
  makeRequest("/auth/forgot-password", "POST", data);
//resetear contraseña
export const resetPassword = (data) =>
  makeRequest("/auth/reset-password", "POST", data);
//verificar cuenta
export const verifyAccount = (data) =>
  makeRequest("/auth/verify-account", "POST", data);
//cambiar contraseña (usuario autenticado)
export const changePassword = (data) =>
  makeRequest("/auth/change-password", "POST", data);
//verificar código 2FA
export const verifyTwoFactor = (data) =>
  makeRequest("/auth/verify-two-factor", "POST", data);
//habilitar 2FA
export const enableTwoFactor = () =>
  makeRequest("/auth/enable-two-factor", "POST");
//deshabilitar 2FA
export const disableTwoFactor = () =>
  makeRequest("/auth/disable-two-factor", "POST");
//actualizar notificación de login
export const updateLoginNotification = (data) =>
  makeRequest("/auth/update-login-notification", "PATCH", data);
//obtener sesiones activas
export const getActiveSessions = () =>
  makeRequest("/auth/active-sessions", "GET");
//cerrar una sesión específica
export const deleteSession = (sessionId) =>
  makeRequest(`/auth/active-sessions/${sessionId}`, "DELETE");
//cerrar todas las sesiones excepto la actual
export const deleteAllOtherSessions = () =>
  makeRequest("/auth/active-sessions", "DELETE");
//actualizar preferencias de notificaciones
export const updateNotifications = (data) =>
  makeRequest("/auth/update-notifications", "PATCH", data);
//actualizar preferencias del usuario
export const updatePreferences = (data) =>
  makeRequest("/auth/update-preferences", "PATCH", data);
//solicitar eliminación de cuenta
export const requestDeleteAccount = () =>
  makeRequest("/auth/request-delete-account", "POST");
//confirmar eliminación de cuenta
export const confirmDeleteAccount = (token) =>
  makeRequest(`/auth/confirm-delete-account?token=${token}`, "POST");
//exportar datos del usuario
export const exportUserData = () =>
  makeRequest("/auth/export-data", "POST");
//obtener lista de timezones disponibles
export const getTimezones = () =>
  makeRequest("/auth/timezones", "GET");
