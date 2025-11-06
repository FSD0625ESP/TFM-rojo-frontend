import { Link } from "react-router-dom";
import { IMG_DEFAULT } from "../constants/images";

//usado en formularios de login, register, forgot password, reset password
export function LogoAndTitle() {
  return (
    <Link
      to="/"
      aria-label="Volver al inicio"
      className="group flex items-center gap-4 self-center text-4xl font-bold text-foreground transition hover:text-primary"
    >
      <div className="flex items-center justify-center">
        <img
          src={IMG_DEFAULT.logo.src}
          alt={IMG_DEFAULT.logo.alt}
          className="h-16 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="transition-colors duration-300 group-hover:text-primary">
        LOL MATCH
      </span>
    </Link>
  );
}
