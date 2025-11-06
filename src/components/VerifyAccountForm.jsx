import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyAccount } from "../services/authService";
import { cn } from "../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FieldDescription } from "../components/ui/field";

export function VerifyAccountForm({ className, ...props }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [verified, setVerified] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setServerError("Invalid or missing verification token.");
        setLoading(false);
        return;
      }

      try {
        await verifyAccount({ token });
        setVerified(true);
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.error("Error verifying account:", err);
        setServerError(err.message || "Verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your account</CardTitle>
          <CardDescription>
            Confirming your email address to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <FieldDescription className="text-center text-muted-foreground">
              Verifying your account... Please wait...
            </FieldDescription>
          ) : verified ? (
            <FieldDescription className="text-center text-green-600">
              Your account has been verified successfully. Redirecting to
              login...
            </FieldDescription>
          ) : (
            <FieldDescription className="text-center text-red-600">
              {serverError}
              <br />
              <Link
                to="/register"
                className="underline hover:text-primary mt-2 inline-block"
              >
                Go back to register
              </Link>
            </FieldDescription>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Already verified?{" "}
        <Link to="/login" className="underline hover:text-primary">
          Go back to login
        </Link>
      </FieldDescription>
    </div>
  );
}
