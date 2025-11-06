import { VerifyAccountForm } from "../components/VerifyAccountForm";
import { LogoAndTitle } from "../components/LogoAndTitle.jsx";

//página con el formulario de restablecimiento de contraseña
export function VerifyAccount() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoAndTitle />
        <VerifyAccountForm />
      </div>
    </div>
  );
}
