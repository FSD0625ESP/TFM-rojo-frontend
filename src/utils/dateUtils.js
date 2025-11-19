//utilidades para formatear fechas

/**
 * Formatea una fecha en formato relativo (ej: "3 months ago", "2 days ago")
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada en formato relativo
 */
export function formatRelativeDate(date) {
    if (!date) return "Never";

    const now = new Date();
    const pastDate = new Date(date);
    const diffInMs = now - pastDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return "Just now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
    } else {
        return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
    }
}

