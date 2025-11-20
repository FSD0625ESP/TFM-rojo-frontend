/**
 * Mapea un timezone a un locale apropiado
 * @param {string} timezone - Timezone del usuario (ej: "Europe/Madrid")
 * @returns {string} - Locale correspondiente (ej: "es-ES")
 */
export function getLocaleFromTimezone(timezone) {
    if (!timezone) return "es-ES";

    const timezoneToLocale = {
        // Europa
        "Europe/Madrid": "es-ES",
        "Europe/London": "en-GB",
        "Europe/Paris": "fr-FR",
        "Europe/Berlin": "de-DE",
        "Europe/Rome": "it-IT",
        "Europe/Amsterdam": "nl-NL",
        "Europe/Lisbon": "pt-PT",
        "Europe/Athens": "el-GR",
        "Europe/Moscow": "ru-RU",
        "Europe/Stockholm": "sv-SE",
        "Europe/Copenhagen": "da-DK",
        "Europe/Helsinki": "fi-FI",
        "Europe/Warsaw": "pl-PL",
        "Europe/Prague": "cs-CZ",
        "Europe/Budapest": "hu-HU",
        "Europe/Bucharest": "ro-RO",
        "Europe/Dublin": "en-IE",
        "Europe/Vienna": "de-AT",
        "Europe/Zurich": "de-CH",
        "Europe/Brussels": "nl-BE",
        "Europe/Luxembourg": "fr-LU",
        "Europe/Monaco": "fr-MC",
        "Europe/Oslo": "no-NO",
        "Europe/Reykjavik": "is-IS",
        "Europe/Belgrade": "sr-RS",
        "Europe/Sofia": "bg-BG",
        "Europe/Tallinn": "et-EE",
        "Europe/Vilnius": "lt-LT",
        "Europe/Riga": "lv-LV",
        "Europe/Kiev": "uk-UA",
        "Europe/Minsk": "be-BY",
        "Europe/Kaliningrad": "ru-RU",
        "Europe/Volgograd": "ru-RU",
        "Europe/Samara": "ru-RU",
        "Europe/Yekaterinburg": "ru-RU",
        "Europe/Omsk": "ru-RU",
        "Europe/Krasnoyarsk": "ru-RU",
        "Europe/Irkutsk": "ru-RU",
        "Europe/Yakutsk": "ru-RU",
        "Europe/Vladivostok": "ru-RU",
        "Europe/Magadan": "ru-RU",
        "Europe/Kamchatka": "ru-RU",
        "Europe/Chisinau": "ro-MD",
        "Europe/Tirane": "sq-AL",
        "Europe/Skopje": "mk-MK",
        "Europe/Zagreb": "hr-HR",
        "Europe/Sarajevo": "bs-BA",
        "Europe/Podgorica": "sr-ME",
        "Europe/Ljubljana": "sl-SI",
        "Europe/Bratislava": "sk-SK",
        "Europe/Nicosia": "el-CY",
        "Europe/Malta": "mt-MT",
        "Europe/Valletta": "mt-MT",
        "Europe/Andorra": "ca-AD",
        "Europe/San_Marino": "it-SM",
        "Europe/Vatican": "it-VA",
        "Europe/Gibraltar": "en-GI",
        "Europe/Isle_of_Man": "en-IM",
        "Europe/Jersey": "en-JE",
        "Europe/Guernsey": "en-GG",
        "Europe/Svalbard": "no-SJ",
        "Europe/Longyearbyen": "no-SJ",
        "Europe/Mariehamn": "sv-AX",
        "Europe/Torshavn": "fo-FO",
        "Europe/St_Helena": "en-SH",
        "Europe/Madeira": "pt-PT",
        "Europe/Azores": "pt-PT",
        "Europe/Canary": "es-ES",
        "Europe/Ceuta": "es-ES",
        "Europe/Melilla": "es-ES",
        // América
        "America/New_York": "en-US",
        "America/Chicago": "en-US",
        "America/Denver": "en-US",
        "America/Los_Angeles": "en-US",
        "America/Phoenix": "en-US",
        "America/Anchorage": "en-US",
        "America/Honolulu": "en-US",
        "America/Toronto": "en-CA",
        "America/Vancouver": "en-CA",
        "America/Montreal": "fr-CA",
        "America/Mexico_City": "es-MX",
        "America/Bogota": "es-CO",
        "America/Lima": "es-PE",
        "America/Santiago": "es-CL",
        "America/Buenos_Aires": "es-AR",
        "America/Sao_Paulo": "pt-BR",
        "America/Rio_Branco": "pt-BR",
        "America/Manaus": "pt-BR",
        "America/Belem": "pt-BR",
        "America/Fortaleza": "pt-BR",
        "America/Recife": "pt-BR",
        "America/Araguaina": "pt-BR",
        "America/Maceio": "pt-BR",
        "America/Bahia": "pt-BR",
        "America/Campo_Grande": "pt-BR",
        "America/Cuiaba": "pt-BR",
        "America/Santarem": "pt-BR",
        "America/Porto_Velho": "pt-BR",
        "America/Boa_Vista": "pt-BR",
        "America/Eirunepe": "pt-BR",
        "America/Rio_Branco": "pt-BR",
        "America/Caracas": "es-VE",
        "America/La_Paz": "es-BO",
        "America/Asuncion": "es-PY",
        "America/Montevideo": "es-UY",
        "America/Cayenne": "fr-GF",
        "America/Paramaribo": "nl-SR",
        "America/Georgetown": "en-GY",
        "America/Guatemala": "es-GT",
        "America/Belize": "en-BZ",
        "America/El_Salvador": "es-SV",
        "America/Managua": "es-NI",
        "America/Costa_Rica": "es-CR",
        "America/Panama": "es-PA",
        "America/Tegucigalpa": "es-HN",
        "America/Havana": "es-CU",
        "America/Jamaica": "en-JM",
        "America/Port-au-Prince": "fr-HT",
        "America/Santo_Domingo": "es-DO",
        "America/Puerto_Rico": "es-PR",
        "America/Guadeloupe": "fr-GP",
        "America/Martinique": "fr-MQ",
        "America/Curacao": "nl-CW",
        "America/Aruba": "nl-AW",
        "America/Barbados": "en-BB",
        "America/Trinidad": "en-TT",
        "America/Grenada": "en-GD",
        "America/St_Lucia": "en-LC",
        "America/St_Vincent": "en-VC",
        "America/Dominica": "en-DM",
        "America/St_Kitts": "en-KN",
        "America/Antigua": "en-AG",
        "America/Montserrat": "en-MS",
        "America/Anguilla": "en-AI",
        "America/Bermuda": "en-BM",
        "America/Nassau": "en-BS",
        "America/Grand_Turk": "en-TC",
        "America/Cayman": "en-KY",
        "America/Belize": "en-BZ",
        "America/Guatemala": "es-GT",
        "America/El_Salvador": "es-SV",
        "America/Managua": "es-NI",
        "America/Costa_Rica": "es-CR",
        "America/Panama": "es-PA",
        "America/Tegucigalpa": "es-HN",
        "America/Havana": "es-CU",
        "America/Jamaica": "en-JM",
        "America/Port-au-Prince": "fr-HT",
        "America/Santo_Domingo": "es-DO",
        "America/Puerto_Rico": "es-PR",
        "America/Guadeloupe": "fr-GP",
        "America/Martinique": "fr-MQ",
        "America/Curacao": "nl-CW",
        "America/Aruba": "nl-AW",
        "America/Barbados": "en-BB",
        "America/Trinidad": "en-TT",
        "America/Grenada": "en-GD",
        "America/St_Lucia": "en-LC",
        "America/St_Vincent": "en-VC",
        "America/Dominica": "en-DM",
        "America/St_Kitts": "en-KN",
        "America/Antigua": "en-AG",
        "America/Montserrat": "en-MS",
        "America/Anguilla": "en-AI",
        "America/Bermuda": "en-BM",
        "America/Nassau": "en-BS",
        "America/Grand_Turk": "en-TC",
        "America/Cayman": "en-KY",
        // Asia
        "Asia/Tokyo": "ja-JP",
        "Asia/Shanghai": "zh-CN",
        "Asia/Hong_Kong": "zh-HK",
        "Asia/Taipei": "zh-TW",
        "Asia/Seoul": "ko-KR",
        "Asia/Singapore": "en-SG",
        "Asia/Bangkok": "th-TH",
        "Asia/Jakarta": "id-ID",
        "Asia/Manila": "en-PH",
        "Asia/Kuala_Lumpur": "ms-MY",
        "Asia/Ho_Chi_Minh": "vi-VN",
        "Asia/Dubai": "ar-AE",
        "Asia/Riyadh": "ar-SA",
        "Asia/Kuwait": "ar-KW",
        "Asia/Bahrain": "ar-BH",
        "Asia/Qatar": "ar-QA",
        "Asia/Muscat": "ar-OM",
        "Asia/Tehran": "fa-IR",
        "Asia/Baghdad": "ar-IQ",
        "Asia/Amman": "ar-JO",
        "Asia/Beirut": "ar-LB",
        "Asia/Damascus": "ar-SY",
        "Asia/Jerusalem": "he-IL",
        "Asia/Nicosia": "el-CY",
        "Asia/Tbilisi": "ka-GE",
        "Asia/Yerevan": "hy-AM",
        "Asia/Baku": "az-AZ",
        "Asia/Yekaterinburg": "ru-RU",
        "Asia/Omsk": "ru-RU",
        "Asia/Krasnoyarsk": "ru-RU",
        "Asia/Irkutsk": "ru-RU",
        "Asia/Yakutsk": "ru-RU",
        "Asia/Vladivostok": "ru-RU",
        "Asia/Magadan": "ru-RU",
        "Asia/Kamchatka": "ru-RU",
        "Asia/Anadyr": "ru-RU",
        "Asia/Urumqi": "zh-CN",
        "Asia/Kathmandu": "ne-NP",
        "Asia/Kolkata": "en-IN",
        "Asia/Colombo": "si-LK",
        "Asia/Dhaka": "bn-BD",
        "Asia/Karachi": "ur-PK",
        "Asia/Kabul": "ps-AF",
        "Asia/Tashkent": "uz-UZ",
        "Asia/Dushanbe": "tg-TJ",
        "Asia/Ashgabat": "tk-TM",
        "Asia/Bishkek": "ky-KG",
        "Asia/Almaty": "kk-KZ",
        "Asia/Aqtobe": "kk-KZ",
        "Asia/Aqtau": "kk-KZ",
        "Asia/Oral": "kk-KZ",
        "Asia/Qyzylorda": "kk-KZ",
        "Asia/Atyrau": "kk-KZ",
        "Asia/Qostanay": "kk-KZ",
        "Asia/Petropavlovsk": "kk-KZ",
        "Asia/Ulaanbaatar": "mn-MN",
        "Asia/Hovd": "mn-MN",
        "Asia/Choibalsan": "mn-MN",
        "Asia/Pyongyang": "ko-KP",
        "Asia/Yangon": "my-MM",
        "Asia/Vientiane": "lo-LA",
        "Asia/Phnom_Penh": "km-KH",
        "Asia/Brunei": "ms-BN",
        "Asia/Makassar": "id-ID",
        "Asia/Pontianak": "id-ID",
        "Asia/Jayapura": "id-ID",
        "Asia/Dili": "tet-TL",
        "Asia/Macau": "zh-MO",
        // África
        "Africa/Cairo": "ar-EG",
        "Africa/Johannesburg": "en-ZA",
        "Africa/Lagos": "en-NG",
        "Africa/Nairobi": "sw-KE",
        "Africa/Casablanca": "ar-MA",
        "Africa/Algiers": "ar-DZ",
        "Africa/Tunis": "ar-TN",
        "Africa/Tripoli": "ar-LY",
        "Africa/Khartoum": "ar-SD",
        "Africa/Addis_Ababa": "am-ET",
        "Africa/Dar_es_Salaam": "sw-TZ",
        "Africa/Kampala": "en-UG",
        "Africa/Kigali": "rw-RW",
        "Africa/Bujumbura": "fr-BI",
        "Africa/Gaborone": "en-BW",
        "Africa/Harare": "en-ZW",
        "Africa/Lusaka": "en-ZM",
        "Africa/Maputo": "pt-MZ",
        "Africa/Windhoek": "en-NA",
        "Africa/Luanda": "pt-AO",
        "Africa/Kinshasa": "fr-CD",
        "Africa/Lubumbashi": "fr-CD",
        "Africa/Douala": "fr-CM",
        "Africa/Libreville": "fr-GA",
        "Africa/Brazzaville": "fr-CG",
        "Africa/Bangui": "fr-CF",
        "Africa/Ndjamena": "fr-TD",
        "Africa/Dakar": "fr-SN",
        "Africa/Abidjan": "fr-CI",
        "Africa/Accra": "en-GH",
        "Africa/Lome": "fr-TG",
        "Africa/Porto-Novo": "fr-BJ",
        "Africa/Niamey": "fr-NE",
        "Africa/Ouagadougou": "fr-BF",
        "Africa/Bamako": "fr-ML",
        "Africa/Conakry": "fr-GN",
        "Africa/Freetown": "en-SL",
        "Africa/Monrovia": "en-LR",
        "Africa/Banjul": "en-GM",
        "Africa/Bissau": "pt-GW",
        "Africa/Praia": "pt-CV",
        "Africa/Sao_Tome": "pt-ST",
        "Africa/Malabo": "es-GQ",
        "Africa/Djibouti": "fr-DJ",
        "Africa/Asmara": "ti-ER",
        "Africa/Mogadishu": "so-SO",
        "Africa/Mbabane": "en-SZ",
        "Africa/Maseru": "en-LS",
        "Africa/Blantyre": "en-MW",
        "Africa/Lilongwe": "en-MW",
        "Africa/Antananarivo": "mg-MG",
        "Africa/Mauritius": "en-MU",
        "Africa/Port_Louis": "en-MU",
        "Africa/Seychelles": "en-SC",
        "Africa/Comoro": "ar-KM",
        "Africa/Moroni": "ar-KM",
        "Africa/Nouakchott": "ar-MR",
        // Oceanía
        "Pacific/Auckland": "en-NZ",
        "Pacific/Sydney": "en-AU",
        "Pacific/Melbourne": "en-AU",
        "Pacific/Brisbane": "en-AU",
        "Pacific/Perth": "en-AU",
        "Pacific/Adelaide": "en-AU",
        "Pacific/Darwin": "en-AU",
        "Pacific/Hobart": "en-AU",
        "Pacific/Guam": "en-GU",
        "Pacific/Port_Moresby": "en-PG",
        "Pacific/Fiji": "en-FJ",
        "Pacific/Tahiti": "fr-PF",
        "Pacific/Honolulu": "en-US",
        "Pacific/Apia": "en-WS",
        "Pacific/Tongatapu": "to-TO",
        "Pacific/Pago_Pago": "en-AS",
        "Pacific/Rarotonga": "en-CK",
        "Pacific/Norfolk": "en-NF",
        "Pacific/Noumea": "fr-NC",
        "Pacific/Guadalcanal": "en-SB",
        "Pacific/Port_Vila": "en-VU",
        "Pacific/Nauru": "en-NR",
        "Pacific/Tarawa": "en-KI",
        "Pacific/Funafuti": "en-TV",
        "Pacific/Wallis": "fr-WF",
        "Pacific/Fakaofo": "en-TK",
        "Pacific/Palau": "en-PW",
        "Pacific/Chatham": "en-NZ",
        "Pacific/Enderbury": "en-KI",
        "Pacific/Kiritimati": "en-KI",
        "Pacific/Midway": "en-UM",
        "Pacific/Wake": "en-UM",
        "Pacific/Efate": "en-VU",
        "Pacific/Kosrae": "en-FM",
        "Pacific/Chuuk": "en-FM",
        "Pacific/Pohnpei": "en-FM",
        "Pacific/Yap": "en-FM",
        "Pacific/Majuro": "en-MH",
        "Pacific/Kwajalein": "en-MH",
        "Pacific/Easter": "es-CL",
        "Pacific/Galapagos": "es-EC",
        "Pacific/Marquesas": "fr-PF",
        "Pacific/Gambier": "fr-PF",
        "Pacific/Pitcairn": "en-PN",
        // Antártida
        "Antarctica/McMurdo": "en-AQ",
        "Antarctica/DumontDUrville": "fr-AQ",
        "Antarctica/Syowa": "ja-AQ",
        "Antarctica/Mawson": "en-AQ",
        "Antarctica/Vostok": "ru-AQ",
        "Antarctica/Davis": "en-AQ",
        "Antarctica/Casey": "en-AQ",
        "Antarctica/Rothera": "en-AQ",
        "Antarctica/Palmer": "en-AQ",
        "Antarctica/Troll": "no-AQ",
        // Ártico
        "Arctic/Longyearbyen": "no-SJ",
    };

    //buscar coincidencia exacta
    if (timezoneToLocale[timezone]) {
        return timezoneToLocale[timezone];
    }

    //si no hay coincidencia exacta, intentar inferir desde el nombre del timezone
    const timezoneLower = timezone.toLowerCase();

    if (timezoneLower.includes("europe")) {
        //intentar inferir desde el nombre de la ciudad
        if (timezoneLower.includes("madrid") || timezoneLower.includes("barcelona") || timezoneLower.includes("valencia")) {
            return "es-ES";
        }
        if (timezoneLower.includes("london")) return "en-GB";
        if (timezoneLower.includes("paris")) return "fr-FR";
        if (timezoneLower.includes("berlin") || timezoneLower.includes("munich")) return "de-DE";
        if (timezoneLower.includes("rome") || timezoneLower.includes("milan")) return "it-IT";
        if (timezoneLower.includes("amsterdam")) return "nl-NL";
        if (timezoneLower.includes("lisbon")) return "pt-PT";
        if (timezoneLower.includes("athens")) return "el-GR";
        if (timezoneLower.includes("moscow") || timezoneLower.includes("st_petersburg")) return "ru-RU";
        //por defecto para Europa
        return "en-GB";
    }

    if (timezoneLower.includes("america")) {
        if (timezoneLower.includes("new_york") || timezoneLower.includes("chicago") || timezoneLower.includes("los_angeles")) {
            return "en-US";
        }
        if (timezoneLower.includes("mexico") || timezoneLower.includes("bogota") || timezoneLower.includes("lima") || timezoneLower.includes("santiago") || timezoneLower.includes("buenos_aires")) {
            return "es-MX";
        }
        if (timezoneLower.includes("sao_paulo") || timezoneLower.includes("rio") || timezoneLower.includes("brasilia")) {
            return "pt-BR";
        }
        if (timezoneLower.includes("toronto") || timezoneLower.includes("vancouver")) {
            return "en-CA";
        }
        //por defecto para América
        return "en-US";
    }

    if (timezoneLower.includes("asia")) {
        if (timezoneLower.includes("tokyo")) return "ja-JP";
        if (timezoneLower.includes("shanghai") || timezoneLower.includes("beijing")) return "zh-CN";
        if (timezoneLower.includes("hong_kong")) return "zh-HK";
        if (timezoneLower.includes("taipei")) return "zh-TW";
        if (timezoneLower.includes("seoul")) return "ko-KR";
        if (timezoneLower.includes("singapore")) return "en-SG";
        if (timezoneLower.includes("bangkok")) return "th-TH";
        if (timezoneLower.includes("jakarta")) return "id-ID";
        if (timezoneLower.includes("manila")) return "en-PH";
        if (timezoneLower.includes("dubai") || timezoneLower.includes("riyadh")) return "ar-AE";
        if (timezoneLower.includes("kolkata") || timezoneLower.includes("mumbai") || timezoneLower.includes("delhi")) {
            return "en-IN";
        }
        //por defecto para Asia
        return "en-US";
    }

    if (timezoneLower.includes("africa")) {
        if (timezoneLower.includes("cairo")) return "ar-EG";
        if (timezoneLower.includes("johannesburg") || timezoneLower.includes("cape_town")) return "en-ZA";
        if (timezoneLower.includes("lagos")) return "en-NG";
        if (timezoneLower.includes("nairobi")) return "sw-KE";
        if (timezoneLower.includes("casablanca")) return "ar-MA";
        //por defecto para África
        return "en-ZA";
    }

    if (timezoneLower.includes("pacific") || timezoneLower.includes("australia")) {
        if (timezoneLower.includes("auckland")) return "en-NZ";
        if (timezoneLower.includes("sydney") || timezoneLower.includes("melbourne")) return "en-AU";
        //por defecto para Oceanía
        return "en-AU";
    }

    //por defecto
    return "es-ES";
}

/**
 * Formatea una fecha usando el timezone y locale del usuario
 * @param {Date|string} date - Fecha a formatear
 * @param {string} timezone - Timezone del usuario (ej: "Europe/Madrid")
 * @param {object} options - Opciones adicionales para toLocaleDateString
 * @returns {string} - Fecha formateada
 */
export function formatDateWithTimezone(date, timezone, options = {}) {
    if (!date) return "";

    const locale = getLocaleFromTimezone(timezone);
    const dateObj = date instanceof Date ? date : new Date(date);

    const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: timezone || "UTC",
    };

    return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
}

/**
 * Formatea una fecha de manera relativa (ej: "hace 2 horas", "hace 3 días")
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Locale para el formato (ej: "es-ES", "en-US")
 * @returns {string} - Fecha formateada de manera relativa
 */
export function formatRelativeDate(date, locale = "es-ES") {
    if (!date) return "";

    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    // Si la fecha es futura, retornar "en el futuro"
    if (diffInSeconds < 0) {
        return locale.startsWith("es") ? "en el futuro" : "in the future";
    }

    // Menos de 1 minuto
    if (diffInSeconds < 60) {
        return locale.startsWith("es") ? "hace unos segundos" : "just now";
    }

    // Menos de 1 hora
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        if (diffInMinutes === 1) {
            return locale.startsWith("es") ? "hace 1 minuto" : "1 minute ago";
        }
        return locale.startsWith("es")
            ? `hace ${diffInMinutes} minutos`
            : `${diffInMinutes} minutes ago`;
    }

    // Menos de 1 día
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if (diffInHours === 1) {
            return locale.startsWith("es") ? "hace 1 hora" : "1 hour ago";
        }
        return locale.startsWith("es")
            ? `hace ${diffInHours} horas`
            : `${diffInHours} hours ago`;
    }

    // Menos de 1 semana
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        if (diffInDays === 1) {
            return locale.startsWith("es") ? "hace 1 día" : "1 day ago";
        }
        return locale.startsWith("es")
            ? `hace ${diffInDays} días`
            : `${diffInDays} days ago`;
    }

    // Menos de 1 mes
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        if (diffInWeeks === 1) {
            return locale.startsWith("es") ? "hace 1 semana" : "1 week ago";
        }
        return locale.startsWith("es")
            ? `hace ${diffInWeeks} semanas`
            : `${diffInWeeks} weeks ago`;
    }

    // Menos de 1 año
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if (diffInMonths === 1) {
            return locale.startsWith("es") ? "hace 1 mes" : "1 month ago";
        }
        return locale.startsWith("es")
            ? `hace ${diffInMonths} meses`
            : `${diffInMonths} months ago`;
    }

    // Más de 1 año
    const diffInYears = Math.floor(diffInDays / 365);
    if (diffInYears === 1) {
        return locale.startsWith("es") ? "hace 1 año" : "1 year ago";
    }
    return locale.startsWith("es")
        ? `hace ${diffInYears} años`
        : `${diffInYears} years ago`;
}
