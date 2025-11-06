import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";
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
  FieldSeparator,
} from "../components/ui/field";
import { loginSchema } from "../schemas/userSchemas";

//formulario de login para la page de login
export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  //inicializa con valores vacíos
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //handler a login con los valores del formulario
  const onSubmit = async (values) => {
    const result = await login(values);
    if (result.success) {
      navigate(from, { replace: true });
      toast.success("Login successful ✅");
    } else {
      toast.error("Error logging in ❌ " + result.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Riot account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  control={form.control}
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
                  control={form.control}
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
