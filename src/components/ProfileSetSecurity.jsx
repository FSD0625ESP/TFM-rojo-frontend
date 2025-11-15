import { useState } from "react";
import { Shield, Key } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { formatRelativeDate } from "../utils/dateUtils";
import { updateLoginNotification } from "../services/authService";
import { Button } from "../components/ui/button";
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
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { PasswordForm } from "./PasswordForm";
import { TwoFactorSetup } from "./TwoFactorSetup";
import { ActiveSessionsDialog } from "./ActiveSessionsDialog";

export function ProfileSetSecurity() {
  const [open, setOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const { user, refreshUser } = useAuth();

  const passwordLastChanged = user?.passwordChangedAt
    ? formatRelativeDate(user.passwordChangedAt)
    : "Never";

  const isTwoFactorEnabled = user?.security?.isTwoFactorEnabled || false;
  const isLoginNotificationEnabled =
    user?.security?.isLoginNotification ?? false;

  const handleLoginNotificationChange = async (checked) => {
    try {
      await updateLoginNotification({ isLoginNotification: checked });
      await refreshUser();
      toast.success(
        `Login notifications ${checked ? "enabled" : "disabled"} ✅`
      );
    } catch (err) {
      toast.error(err.message || "Error updating notification setting ❌");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Password</Label>
                <p className="text-muted-foreground text-sm">
                  Last changed {passwordLastChanged}
                </p>
              </div>
              <Button variant="outline" onClick={() => setOpen(true)}>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-muted-foreground text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <TwoFactorSetup
                isEnabled={isTwoFactorEnabled}
                onToggle={async (enabled) => {
                  await refreshUser();
                }}
              />
            </div>

            <Separator />

            {/* Login Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Login Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified when someone logs into your account
                </p>
              </div>
              <Switch
                checked={isLoginNotificationEnabled}
                onCheckedChange={handleLoginNotificationChange}
                id="loginNotifications"
                className="border-foreground/50"
              />
            </div>

            <Separator />

            {/* Active Sessions */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Active Sessions</Label>
                <p className="text-muted-foreground text-sm">
                  Manage devices that are logged into your account
                </p>
              </div>
              <Button variant="outline" onClick={() => setSessionsOpen(true)}>
                <Shield className="mr-2 h-4 w-4" />
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Modal Password */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <PasswordForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal Active Sessions */}
      <ActiveSessionsDialog
        open={sessionsOpen}
        onOpenChange={setSessionsOpen}
      />
    </div>
  );
}
