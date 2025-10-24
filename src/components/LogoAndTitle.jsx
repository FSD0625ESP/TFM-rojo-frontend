import { Link } from "react-router-dom";

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
          src="./logo.png"
          alt="Logo LOL Match"
          className="h-16 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="transition-colors duration-300 group-hover:text-primary">
        LOL MATCH
      </span>
    </Link>
  );
}
