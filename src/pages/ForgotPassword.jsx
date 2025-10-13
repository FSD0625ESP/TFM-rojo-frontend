import { ForgotPasswordForm } from "../components/forgot-password-form";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-4 self-center text-4xl font-bold"
        >
          <div className="flex items-center justify-center">
            <img src="./logo.png" alt="Logo LOL Match" className="h-16" />
          </div>
          LOL MATCH
        </Link>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
