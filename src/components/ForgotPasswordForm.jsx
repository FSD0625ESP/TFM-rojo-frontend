import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../lib/utils";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { forgotPassword } from "../services/authService";

//esquema de validación con zod
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

//formulario para recuperar la contraseña
export function ForgotPasswordForm({ className, ...props }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  //inicializamos el formulario vacío
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }) => {
    setServerError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      console.error("Error sending recovery email:", err);
      const message = err.message || "";

      if (message.includes("404") || message.includes("User not found")) {
        setServerError("If an account exists with this email, a recovery link has been sent.");
      } else {
        setServerError("Error sending recovery email. Please check your email and try again.");
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
              If an account exists for <strong>{form.getValues("email")}</strong>, you’ll receive
              a recovery link shortly.
            </FieldDescription>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                        {serverError && (
                          <p className="text-sm text-red-500 mt-1">{serverError}</p>
                        )}
                      </FormItem>
                    )}
                  />
                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send recovery link"}
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
