import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService.js";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      console.error("Error sending recovery email:", err);
      
      // Extraer el código de estado del error si está disponible
      const errorMessage = err.message || "Error sending recovery email. Please try again.";
      
      // Si es un error de usuario no encontrado (404), mostrar mensaje genérico por seguridad
      if (errorMessage.includes("404") || errorMessage.includes("User not found")) {
        setError("If an account exists with this email, a recovery link has been sent.");
      } else {
        setError("Error sending recovery email. Please check your email and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a recovery link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <FieldDescription className="text-center text-green-600">
              If an account exists for <strong>{email}</strong>, you’ll receive
              a recovery link shortly.
            </FieldDescription>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </Field>
                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send recovery link"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Remembered your password?{" "}
        <Link to="/login" className="underline hover:text-primary">
          Go back to login
        </Link>
      </FieldDescription>
    </div>
  );
}
