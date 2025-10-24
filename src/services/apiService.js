const API_URL = import.meta.env.VITE_API_URL;

//normaliza la url eliminando barras duplicadas al inicio o final
export function normalizeUrl(endpoint) {
  return `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

//intenta extraer el mensaje de error desde la respuesta
export async function parseError(res) {
  try {
    const error = await res.json();
    return error.message || JSON.stringify(error);
  } catch {
    const text = await res.text();
    return text || "API error occurred ❌";
  }
}

//función base para hacer peticiones con manejo de errores
export async function makeRequest(endpoint, method = "GET", body = null) {
  const res = await fetch(normalizeUrl(endpoint), {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const error = await parseError(res);
    throw new Error(`${res.status}: ${error}`);
  }

  return res.status === 204 ? null : res.json();
}