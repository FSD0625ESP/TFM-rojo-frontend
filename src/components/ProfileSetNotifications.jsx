import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { updateNotifications } from "../services/authService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";

export function ProfileSetNotifications() {
  const { user, refreshUser } = useAuth();

  //estados locales para los switches
  const [emailNotification, setEmailNotification] = useState(
    user?.notifications?.emailNotification ?? true
  );
  const [pushNotification, setPushNotification] = useState(
    user?.notifications?.pushNotification ?? true
  );
  const [marketingNotification, setMarketingNotification] = useState(
    user?.notifications?.marketingNotification ?? true
  );
  const [weeklyNotification, setWeeklyNotification] = useState(
    user?.notifications?.weeklyNotification ?? true
  );
  const securityNotification = user?.notifications?.securityNotification ?? false;

  //actualizar estados cuando cambie el usuario
  useEffect(() => {
    if (user?.notifications) {
      setEmailNotification(user.notifications.emailNotification ?? true);
      setPushNotification(user.notifications.pushNotification ?? true);
      setMarketingNotification(user.notifications.marketingNotification ?? true);
      setWeeklyNotification(user.notifications.weeklyNotification ?? true);
    }
  }, [user]);

  //handler para actualizar notificaciones
  const handleNotificationChange = async (field, value) => {
    try {
      await updateNotifications({ [field]: value });
      await refreshUser();
      toast.success("Notification preferences updated successfully ✅");
    } catch (err) {
      toast.error(err.message || "Error updating notification preferences ❌");
      //revertir el cambio en caso de error
      switch (field) {
        case "emailNotification":
          setEmailNotification(!value);
          break;
        case "pushNotification":
          setPushNotification(!value);
          break;
        case "marketingNotification":
          setMarketingNotification(!value);
          break;
        case "weeklyNotification":
          setWeeklyNotification(!value);
          break;
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailNotification}
                onCheckedChange={(checked) => {
                  setEmailNotification(checked);
                  handleNotificationChange("emailNotification", checked);
                }}
                className="border-foreground/50"
              />
            </div>

            <Separator />

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={pushNotification}
                onCheckedChange={(checked) => {
                  setPushNotification(checked);
                  handleNotificationChange("pushNotification", checked);
                }}
                className="border-foreground/50"
              />
            </div>

            <Separator />

            {/* Marketing Emails */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-muted-foreground text-sm">
                  Receive emails about new features and updates
                </p>
              </div>
              <Switch
                checked={marketingNotification}
                onCheckedChange={(checked) => {
                  setMarketingNotification(checked);
                  handleNotificationChange("marketingNotification", checked);
                }}
                className="border-foreground/50"
              />
            </div>

            <Separator />

            {/* Weekly Summary */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Weekly Summary</Label>
                <p className="text-muted-foreground text-sm">
                  Get a weekly summary of your activity
                </p>
              </div>
              <Switch
                checked={weeklyNotification}
                onCheckedChange={(checked) => {
                  setWeeklyNotification(checked);
                  handleNotificationChange("weeklyNotification", checked);
                }}
                className="border-foreground/50"
              />
            </div>

            <Separator />

            {/* Security Alerts */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Security Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Important security notifications (always enabled)
                </p>
              </div>
              <Switch checked={securityNotification} disabled className="border-foreground/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
