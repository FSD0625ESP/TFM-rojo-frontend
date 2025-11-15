import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { verifyTwoFactor } from "../services/authService";
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
  FieldSeparator,
} from "../components/ui/field";
import { loginSchema } from "../schemas/userSchemas";

//esquema para validar código 2FA
const twoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

//formulario de login para la page de login
export function LoginForm({ className, ...props }) {
  const { login, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState("");

  //formulario de login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //formulario de código 2FA
  const twoFactorForm = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  //handler a login con los valores del formulario
  const onSubmit = async (values) => {
    const result = await login(values);
    if (result.success) {
      navigate(from, { replace: true });
      toast.success("Login successful ✅");
    } else if (result.requiresTwoFactor) {
      //mostrar formulario de código 2FA
      setRequiresTwoFactor(true);
      setTwoFactorEmail(result.email);
      toast.info("Check your email for the verification code");
    } else {
      toast.error("Error logging in ❌ " + result.message);
    }
  };

  //handler para verificar código 2FA
  const onVerifyCode = async (values) => {
    try {
      const data = await verifyTwoFactor({
        email: twoFactorEmail,
        code: values.code,
      });
      
      //el login se completa automáticamente con la cookie
      //actualizar el contexto y redirigir
      await refreshUser();
      
      //si hay otras sesiones activas, mostrar toast
      if (data.hasOtherSessions) {
        toast.warning(
          "New login detected from another device. Check your active sessions.",
          {
            duration: 5000,
          }
        );
      } else {
        toast.success("Login successful ✅");
      }
      
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.message || "Invalid code ❌";
      toast.error(errorMessage);
      twoFactorForm.setError("code", {
        type: "server",
        message: "Invalid or expired code",
      });
    }
  };

  //si requiere 2FA, mostrar formulario de código
  if (requiresTwoFactor) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...twoFactorForm}>
              <form onSubmit={twoFactorForm.handleSubmit(onVerifyCode)}>
                <FieldGroup>
                  <FormField
                    control={twoFactorForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000000"
                            maxLength={6}
                            className="text-center text-2xl tracking-widest"
                            {...field}
                            onChange={(e) => {
                              //solo permitir números
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Field>
                    <Button type="submit" className="w-full">
                      Verify Code
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setRequiresTwoFactor(false);
                        twoFactorForm.reset();
                      }}
                    >
                      Back to Login
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Riot account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <a
                    href="https://authenticate.riotgames.com/?client_id=accountodactyl-prod&method=riot_identity&platform=web&redirect_uri=https%3A%2F%2Fauth.riotgames.com%2Fauthorize%3Facr_values%3Durn%3Ariot%3Agold%26client_id%3Daccountodactyl-prod%26redirect_uri%3Dhttps%3A%2F%2Faccount.riotgames.com%2Foauth2%2Flog-in%26response_type%3Dcode%26scope%3Dopenid%2520email%2520profile%2520riot%3A%2F%2Friot.atlas%2Fopenid%2520riot%3A%2F%2Friot.atlas%2Faccounts.edit%2520riot%3A%2F%2Friot.atlas%2Faccounts%2Fpassword.edit%2520riot%3A%2F%2Friot.atlas%2Faccounts%2Femail.edit%2520riot%3A%2F%2Friot.atlas%2Faccounts.auth%2520riot%3A%2F%2Fthird_party.revoke%2520riot%3A%2F%2Fthird_party.query%2520riot%3A%2F%2Fforgetme%2Fnotify.write%2520riot%3A%2F%2Friot.authenticator%2Fauth.code%2520riot%3A%2F%2Friot.authenticator%2Fauthz.edit%2520riot%3A%2F%2Frso%2Fmfa%2Fdevice.write%2520riot%3A%2F%2Friot.authenticator%2Fidentity.add%2520riot%3A%2F%2Friot.atlas%2Faccounts.read%26state%3Dddc9e73d-dbb7-49eb-bd95-221a365043d3&security_profile=high"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 2500 2500"
                        className="w-5 h-5"
                        fill="currentColor"
                      >
                        <path d="M0 0v2500h2500V0H0zm2065.5 1160.5-113.5 679.5-679.5 113.5-679.5-113.5L479.5 1160.5 593 481l679.5-113.5L1952 481l113.5 679.5z" />
                      </svg>
                      Login with Riot
                    </Button>
                  </a>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="miusuario@lolmatch.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Field>
                  <Button type="submit">Login</Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
