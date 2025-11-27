// ProfileContent.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { updateProfileSchema } from "../schemas/userSchemas";

// 👇 NUEVOS IMPORTS PARA LOS MENÚS DESPLEGABLES
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// 👇 CONSTANTES DE DATOS (Las definimos fuera para que no molesten)
const REGIONS = [
  "EUW",
  "NA",
  "EUNE",
  "KR",
  "JP",
  "BR",
  "LAS",
  "LAN",
  "OCE",
  "RU",
  "TR",
];
const ROLES = ["Top", "Jungle", "Mid", "ADC", "Support"];
const RANKS = [
  "Unranked",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];
const DIVISIONS = ["I", "II", "III", "IV"];

export function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // 🎨 ESTILOS DINÁMICOS:
  const DISABLED_STYLE =
    "bg-secondary/40 border-transparent shadow-none focus-visible:ring-0 cursor-not-allowed text-muted-foreground opacity-70";

  const readOnlyClass = !isEditing
    ? "bg-secondary/40 border-transparent shadow-none focus-visible:ring-0 cursor-default text-muted-foreground"
    : "";

  // Inicializar formulario con react-hook-form
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      country: "",
      discord: "",
      hobbies: "",
      bio: "",
      gameName: "",
      tagLine: "",
      region: "EUW",
      roleLol: undefined,
      tier: null,
      ranks: null,
    },
  });

  // Actualizar valores del formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.contact?.name || "",
        lastName: user.contact?.lastname || "",
        phone: user.contact?.phone || "",
        city: user.address?.city || "",
        country: user.address?.country || "",
        discord: user.contact?.discord || "",
        hobbies: user.contact?.hobbies || "",
        bio: user.profile?.bio || "",
        gameName: user.lolProfile?.gameName || "",
        tagLine: user.lolProfile?.tagLine || "",
        region: user.lolProfile?.region || "EUW",
        roleLol: user.lolProfile?.roleLol || undefined,
        tier: user.lolProfile?.tier || null,
        ranks: user.lolProfile?.ranks || null,
      });
    }
  }, [user, form]);

  const onSubmit = async (values) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/update-profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || "Error updating profile";
        throw new Error(errorMessage);
      }

      const updatedUser = await res.json();
      updateUser(updatedUser);
      // Resetear el formulario con los nuevos valores
      form.reset({
        firstName: updatedUser.contact?.name || "",
        lastName: updatedUser.contact?.lastname || "",
        phone: updatedUser.contact?.phone || "",
        city: updatedUser.address?.city || "",
        country: updatedUser.address?.country || "",
        discord: updatedUser.contact?.discord || "",
        hobbies: updatedUser.contact?.hobbies || "",
        bio: updatedUser.profile?.bio || "",
        gameName: updatedUser.lolProfile?.gameName || "",
        tagLine: updatedUser.lolProfile?.tagLine || "",
        region: updatedUser.lolProfile?.region || "EUW",
        roleLol: updatedUser.lolProfile?.roleLol || undefined,
        tier: updatedUser.lolProfile?.tier || null,
        ranks: updatedUser.lolProfile?.ranks || null,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      toast.error(err.message || "Error updating profile");
    }
  };

  return (
    <Tabs defaultValue="personal">
      <TabsContent value="personal" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* First Name */}
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Last Name */}
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email - SIEMPRE BLOQUEADO */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      readOnly={true}
                      className={DISABLED_STYLE}
                    />
                  </div>

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+34 123 456 789 (numbers and symbols allowed)"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Madrid"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Spain"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  {/* Discord */}
                  <FormField
                    control={form.control}
                    name="discord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="username#1234 or username"
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hobbies */}
                  <FormField
                    control={form.control}
                    name="hobbies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hobbies</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Gaming, Reading, Sports..."
                            readOnly={!isEditing}
                            className={readOnlyClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio (Textarea) */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Tell us about yourself..."
                            readOnly={!isEditing}
                            rows={6}
                            className={`resize-none ${readOnlyClass}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* SECCIÓN SUMMONER INFO (Con Selects) */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Summoner Info</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Game Name */}
                    <FormField
                      control={form.control}
                      name="gameName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Game Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your Riot Game Name"
                              readOnly={!isEditing}
                              className={readOnlyClass}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tag Line (#) con Prefijo Visual Fijo */}
                    <FormField
                      control={form.control}
                      name="tagLine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag Line</FormLabel>
                          <FormControl>
                            <div className="relative">
                              {/* SÍMBOLO # FIJO */}
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none font-medium">
                                #
                              </span>
                              <Input
                                {...field}
                                placeholder="EUW"
                                onChange={(e) => {
                                  // Truco: Si el usuario escribe "#", lo borramos para que no se duplique
                                  const cleanValue = e.target.value.replace(
                                    /^#/,
                                    ""
                                  );
                                  field.onChange(cleanValue);
                                }}
                                readOnly={!isEditing}
                                className={`${readOnlyClass} pl-7`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* REGION (SELECT) */}
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region</FormLabel>
                          {isEditing ? (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {REGIONS.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={field.value}
                              readOnly
                              className={readOnlyClass}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* MAIN ROLE (SELECT) */}
                    <FormField
                      control={form.control}
                      name="roleLol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Role</FormLabel>
                          {isEditing ? (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ROLES.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={field.value || ""}
                              readOnly
                              className={readOnlyClass}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* RANK (SELECT) */}
                    <FormField
                      control={form.control}
                      name="ranks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rank (Elo)</FormLabel>
                          {isEditing ? (
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val === "unranked" ? null : val);
                              }}
                              value={field.value || "unranked"}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Rank" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RANKS.map((rank) => (
                                  <SelectItem
                                    key={rank}
                                    value={rank === "Unranked" ? "unranked" : rank}
                                  >
                                    {rank}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={field.value || "Unranked"}
                              readOnly
                              className={readOnlyClass}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TIER/DIVISION (SELECT) */}
                    <FormField
                      control={form.control}
                      name="tier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          {isEditing ? (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              disabled={
                                form.watch("ranks") === "Challenger" ||
                                form.watch("ranks") === "Grandmaster" ||
                                form.watch("ranks") === "Master"
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Division" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DIVISIONS.map((div) => (
                                  <SelectItem key={div} value={div}>
                                    {div}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={field.value || ""}
                              readOnly
                              className={readOnlyClass}
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Botón editar/guardar/cancelar */}
                <div className="flex justify-end gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Resetear formulario a los valores originales del usuario
                          if (user) {
                            form.reset({
                              firstName: user.contact?.name || "",
                              lastName: user.contact?.lastname || "",
                              phone: user.contact?.phone || "",
                              city: user.address?.city || "",
                              country: user.address?.country || "",
                              discord: user.contact?.discord || "",
                              hobbies: user.contact?.hobbies || "",
                              bio: user.profile?.bio || "",
                              gameName: user.lolProfile?.gameName || "",
                              tagLine: user.lolProfile?.tagLine || "",
                              region: user.lolProfile?.region || "EUW",
                              roleLol: user.lolProfile?.roleLol || undefined,
                              tier: user.lolProfile?.tier || null,
                              ranks: user.lolProfile?.ranks || null,
                            });
                          }
                          setIsEditing(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save changes</Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
