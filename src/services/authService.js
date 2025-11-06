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
