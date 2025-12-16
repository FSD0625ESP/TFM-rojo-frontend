const API_URL = import.meta.env.VITE_API_URL;
import { clearAuthCookies } from "../utils/authInterceptor";

//normaliza la url eliminando barras duplicadas al inicio o final
export function normalizeUrl(endpoint) {
  return `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

//intenta extraer el mensaje de error desde la respuesta
export async function parseError(res) {
  try {
    const error = await res.json();
    //si hay un array de errores de validación, devolver el objeto completo
    if (error.errors && Array.isArray(error.errors)) {
      return error;
    }
    //si hay un mensaje, devolverlo
    return error.message || error;
  } catch {
    const text = await res.text();
    return text || "API error occurred ❌";
  }
}

//función base para hacer peticiones con manejo de errores
export async function makeRequest(endpoint, method = "GET", body = null, options = {}) {
  const res = await fetch(normalizeUrl(endpoint), {
    method,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  //manejar errores 401 antes de procesar la respuesta
  //esto asegura que las cookies se limpien cuando la sesión expira
  if (res.status === 401 && !options.skipAuthError) {
    clearAuthCookies();

    //si hay un callback personalizado, ejecutarlo
    if (options.onUnauthorized) {
      options.onUnauthorized();
    }
  }

  if (!res.ok) {
    const error = await parseError(res);
    //si el error es un objeto, convertirlo a string JSON para mantener la estructura
    const errorString = typeof error === "object" ? JSON.stringify(error) : error;
    throw new Error(`${res.status}: ${errorString}`);
  }

  return res.status === 204 ? null : res.json();
}