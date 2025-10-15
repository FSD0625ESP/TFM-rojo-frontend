const API_URL = import.meta.env.VITE_API_URL;

//utilidad para normalizar URLs
function normalizeUrl(endpoint) {
  return `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

//utilidad para parsear errores
async function parseError(res) {
  try {
    const error = await res.json();
    return error.message || JSON.stringify(error);
  } catch {
    const text = await res.text();
    return text || "API error occurred ❌";
  }
}

//registro de usuario
export async function registerUser(data) {
  const res = await fetch(normalizeUrl("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

//login de usuario
export async function loginUser(data) {
  const res = await fetch(normalizeUrl("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

//logout de usuario
export async function logoutUser() {
  const res = await fetch(normalizeUrl("auth/logout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

//recuperar contraseña
export async function forgotPassword(data) {
  const res = await fetch(normalizeUrl("auth/forgot-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

//resetear contraseña
export async function resetPassword(data) {
  const res = await fetch(normalizeUrl("auth/reset-password"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

// ESTE CÓDIGO USA EL ARCHIVO api.js
// import { request } from "./api";

// export const registerUser = (data) => request("auth/register", "POST", data);
// export const loginUser = (data) => request("auth/login", "POST", data);
// export const forgotPassword = (data) =>
//   request("auth/forgot-password", "POST", data);
// export const resetPassword = (data) =>
//   request("auth/reset-password", "POST", data);
// export const logoutUser = () => request("auth/logout", "POST");
