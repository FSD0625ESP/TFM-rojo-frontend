import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { changePasswordSchema } from "../schemas/userSchemas";
import { changePassword } from "../services/authService.js";
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

export function PasswordForm({ onSuccess }) {
  const { refreshUser } = useAuth();
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await changePassword(values);
      toast.success(response.message || "Password changed successfully ✅");
      form.reset();
      //refrescar los datos del usuario para actualizar passwordChangedAt
      await refreshUser();
      onSuccess?.();
    } catch (err) {
      //manejar errores de validación del backend (array de errors)
      const errorMessage = err.message || "Error changing password ❌";

      //intentar extraer errores de validación si vienen en formato "400: {...}"
      if (errorMessage.includes("400:")) {
        try {
          const errorPart = errorMessage.split("400:")[1].trim();
          //intentar parsear como JSON
          let errorData;
          try {
            errorData = JSON.parse(errorPart);
          } catch {
            //si no es JSON válido, tratar como string simple
            toast.error(errorPart || "Validation error");
            return;
          }

          //si hay un array de errores de validación
          if (errorData.errors && Array.isArray(errorData.errors)) {
            //establecer errores en los campos correspondientes
            errorData.errors.forEach((error) => {
              form.setError(error.field, {
                type: "server",
                message: error.message,
              });
            });
            toast.error("Please fix the validation errors");
            return;
          }

          //si hay un mensaje de error simple
          if (errorData.message) {
            toast.error(errorData.message);
            return;
          }
        } catch {
          //si falla el parsing, continuar con el mensaje de error general
        }
      }

      //mostrar mensaje de error general
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} className="bg-muted" />
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
                <Input type="password" {...field} className="bg-muted" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
