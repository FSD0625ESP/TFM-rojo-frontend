import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { LogoAndTitle } from "../components/LogoAndTitle.jsx";

export function ResetPassword() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoAndTitle />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
