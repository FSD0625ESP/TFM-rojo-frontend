import { SignupForm } from "../components/SignupForm";
import { LogoAndTitle } from "../components/LogoAndTitle.jsx";

//página con el formulario de registro
export function Signup() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoAndTitle />
        <SignupForm />
      </div>
    </div>
  );
}
