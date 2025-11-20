//función para construir URLs de la API
//obtener la URL base de la API desde las variables de entorno
const getApiBase = () => {
    return import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";
};

//función helper para construir URLs de la API
//si API_BASE ya termina en /api, lo usa directamente; si no, agrega /api
//útil para construir URLs consistentes independientemente de cómo esté configurado VITE_API_URL
export const buildApiUrl = (endpoint) => {
    const API_BASE = getApiBase();
    return API_BASE.endsWith("/api")
        ? `${API_BASE}${endpoint}`
        : `${API_BASE}/api${endpoint}`;
};

