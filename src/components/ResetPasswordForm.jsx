import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { cn } from "../lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "../components/ui/field";

//esquema de validación con zod
const resetSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({ className, ...props }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setServerError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  const onSubmit = async (values) => {
    if (!token) {
      setServerError("Invalid or missing reset token.");
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      await resetPassword({
        token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      const message = err.message || "Error resetting password.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Set a new password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <FieldDescription className="text-center text-green-600">
              Your password has been reset successfully. Redirecting to login...
            </FieldDescription>
          ) : !token ? (
            <FieldDescription className="text-center text-red-600">
              Invalid or missing reset token. Please request a new password reset.
              <br />
              <Link
                to="/forgot-password"
                className="underline hover:text-primary mt-2 inline-block"
              >
                Request new reset link
              </Link>
            </FieldDescription>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {serverError && (
                    <p className="text-sm text-red-500 mt-1">{serverError}</p>
                  )}
                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </Form>
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
