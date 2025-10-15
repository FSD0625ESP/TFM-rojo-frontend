const API_URL = import.meta.env.VITE_API_URL;

//función para remover la barra / al final
export function normalizeUrl(endpoint) {
  return `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

//función para hacer peticiones a la API
export async function request(endpoint, method = "GET", body = null) {
  console.log("Request body:", body);
  //fetch genérico
  const res = await fetch(normalizeUrl(endpoint), {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include", //para incluir las cookies
    body: body ? JSON.stringify(body) : null,
  });

  //si la petición falla
  if (!res.ok) {
    let message = "API error occurred ❌";
    try {
      const error = await res.json();
      message = error.message || JSON.stringify(error);
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(`${res.status}: ${message}`);
  }

  //si la petición fue exitosa
  return res.status === 204 ? null : res.json();
}
