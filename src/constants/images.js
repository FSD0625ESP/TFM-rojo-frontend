//base de todas las imágenes
const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dotrj7xbo/image/upload/";

//modificadores para recortar y optimizar imágenes
//tamaño 300x300, c_fit redimensiona sin recortar, f_auto mejor formato, q_auto mejora calidad
const MODIFIER_300 = "w_300,h_300,c_fit,f_auto,q_auto/";
//tamaño 250x250, c_fit redimensiona sin recortar, f_auto mejor formato, q_auto mejora calidad
const MODIFIER_250 = "w_250,h_250,c_fit,f_auto,q_auto/";

//folder dentro de cloudinary
const FOLDER = "v1762381404/";

export const IMG_DEFAULT = {
  logo: {
    src: `/logo.webp`,
    alt: "logo-lol-match",
  },
  number1: {
    src: `/images/icons/number-1.png`,
    alt: "number-1",
  },
  number2: {
    src: `/images/icons/number-2.png`,
    alt: "number-2",
  },
  number3: {
    src: `/images/icons/number-3.png`,
    alt: "number-3",
  },
  number4: {
    src: `/images/icons/number-4.png`,
    alt: "number-4",
  },
  avatar: {
    src: `/images/default-avatar.webp`,
    alt: "default-avatar",
  },
  profileIcon: {
    src: `/images/default-profile-icon.webp`,
    alt: "profile-icon",
  },
  avatarGuest: {
    src: `/images/guest-avatar.webp`,
    alt: "guest-avatar",
  },
};

export const IMG_ROLES = {
  top: {
    src: `/images/icons/role-top.png`,
    alt: "top-role",
  },
  jungle: {
    src: `/images/icons/role-jungle.png`,
    alt: "jungle-role",
  },
  mid: {
    src: `/images/icons/role-mid.png`,
    alt: "mid-role",
  },
  adc: {
    src: `/images/icons/role-adc.png`,
    alt: "adc-role",
  },
  support: {
    src: `/images/icons/role-support.png`,
    alt: "support-role",
  },
};

//función generadora dinámica de avatares de prueba
export const createAvatarMocks = (count) => {
  const avatars = {};

  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(2, "0"); //asegura formato 01, 02...
    const key = `a${num}`; //clave para el avatar, formato a01, a02, ...

    avatars[key] = {
      src: `/images/avatars/avatar-mock-${num}.webp`,
      alt: `avatar-${num}`,
    };
  }

  return avatars;
};

export const IMG_AVATAR_MOCKS = createAvatarMocks(22);
