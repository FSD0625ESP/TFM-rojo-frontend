import Cookies from 'js-cookie';

/**
 * Limpia todas las cookies de autenticación relacionadas
 * Útil cuando se cambia de dominio o cuando la sesión expira
 */
export function clearAuthCookies() {
    //limpiar cookies del dominio actual
    Cookies.remove("userData");

    //intentar limpiar cookies de otros dominios (puede no funcionar por seguridad del navegador)
    try {
        Cookies.remove("userData", { domain: ".netlify.app" });
        Cookies.remove("userData", { domain: ".lolmatch.online" });
        Cookies.remove("userData", { domain: "lol-match.netlify.app" });
        Cookies.remove("userData", { domain: "lolmatch.online" });
    } catch (e) {
        //ignorar errores de dominio (normal en navegadores por políticas de seguridad)
    }
}

/**
 * Maneja errores 401 de forma centralizada
 * @param {Response} response - Respuesta de fetch
 * @param {Function} onUnauthorized - Callback cuando se detecta 401
 * @returns {Promise<Response>} - Respuesta original o rechazada
 */
export async function handleAuthError(response, onUnauthorized) {
    if (response.status === 401) {
        //limpiar cookies de autenticación
        clearAuthCookies();

        //ejecutar callback si se proporciona
        if (onUnauthorized) {
            onUnauthorized();
        }

        //lanzar error para que el código que llama pueda manejarlo
        throw new Error("Unauthorized - Session expired");
    }

    return response;
}

