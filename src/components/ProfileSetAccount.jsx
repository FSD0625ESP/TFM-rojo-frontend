import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updatePreferences, requestDeleteAccount, exportUserData } from "../services/authService";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function ProfileSetAccount() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(
    user?.preferences?.isVisible ?? true
  );
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [exportDataDialogOpen, setExportDataDialogOpen] = useState(false);
  const [exportDataLoading, setExportDataLoading] = useState(false);

  //actualizar estado cuando cambie el usuario
  useEffect(() => {
    if (user?.preferences) {
      setIsVisible(user.preferences.isVisible ?? true);
    }
  }, [user]);

  //handler para actualizar visibilidad
  const handleVisibilityChange = async (checked) => {
    try {
      setIsVisible(checked);
      await updatePreferences({ isVisible: checked });
      await refreshUser();
      toast.success("Account visibility updated successfully ✅");
    } catch (err) {
      toast.error(err.message || "Error updating account visibility ❌");
      //revertir el cambio en caso de error
      setIsVisible(!checked);
    }
  };

  //handler para solicitar eliminación de cuenta
  const handleRequestDeleteAccount = async () => {
    setDeleteAccountLoading(true);
    try {
      await requestDeleteAccount();
      setDeleteAccountDialogOpen(false);
      toast.success(
        "A confirmation email has been sent. Please check your inbox to confirm account deletion.",
        { duration: 8000 }
      );
    } catch (err) {
      toast.error(err.message || "Error requesting account deletion ❌");
    } finally {
      setDeleteAccountLoading(false);
    }
  };

  //handler para exportar datos
  const handleExportData = async () => {
    setExportDataLoading(true);
    try {
      await exportUserData();
      setExportDataDialogOpen(false);
      toast.success(
        "Your data export has been sent to your email. Please check your inbox.",
        { duration: 8000 }
      );
    } catch (err) {
      toast.error(err.message || "Error exporting data ❌");
    } finally {
      setExportDataLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Status</Label>
              <p className="text-muted-foreground text-sm">
                Your account is currently active
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              Active
            </Badge>
          </div>

          <Separator />

          {/* Subscription Plan */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Subscription Plan</Label>
              <p className="text-muted-foreground text-sm">
                Free Plan - Limited Access
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSubscriptionDialogOpen(true)}
            >
              Manage Subscription
            </Button>
          </div>

          <Separator />

          {/* Account Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Visibility</Label>
              <p className="text-muted-foreground text-sm">
                Make your profile visible to other users
              </p>
            </div>
            <Switch
              checked={isVisible}
              onCheckedChange={handleVisibilityChange}
              className="border-foreground/50"
            />
          </div>

          <Separator />

          {/* Data Export */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Data Export</Label>
              <p className="text-muted-foreground text-sm">
                Download a copy of your data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setExportDataDialogOpen(true)}
            >
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Delete Account</Label>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteAccountDialogOpen(true)}
              disabled={deleteAccountLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscription Plan</DialogTitle>
            <DialogDescription>
              Information about your current subscription plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Current Plan</Label>
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  Free Plan
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                You are currently on the <strong>Free Plan</strong> with{" "}
                <strong>Limited Access</strong>.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-base font-semibold">Coming Soon</Label>
              <p className="text-sm text-muted-foreground">
                We are working on bringing you a <strong>Premium Plan</strong>{" "}
                with enhanced features and unlimited access. You will be able to
                upgrade your account to premium status in the near future.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-destructive mb-2">
                ⚠️ Warning: This action is irreversible
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                By confirming, you will permanently delete:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Your account</li>
                <li>All your personal data</li>
                <li>All your statistics and settings</li>
                <li>All your active sessions</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email will be sent to your registered email address. You must click the link in that email to complete the account deletion process.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteAccountDialogOpen(false)}
              disabled={deleteAccountLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRequestDeleteAccount}
              disabled={deleteAccountLoading}
            >
              {deleteAccountLoading ? "Sending..." : "Send Confirmation Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Data Confirmation Dialog */}
      <Dialog open={exportDataDialogOpen} onOpenChange={setExportDataDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Request a complete copy of your personal data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              We will send you an email with a JSON file containing all your account information, including:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Account details (username, email, role)</li>
              <li>Profile information (avatar, preferences, visibility settings)</li>
              <li>Security settings (2FA status, login notifications)</li>
              <li>Notification preferences</li>
              <li>Contact and address information</li>
              <li>League of Legends profile and statistics</li>
              <li>Active sessions information</li>
              <li>Account creation and update dates</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📧 The data export will be sent to: <strong>{user?.email}</strong>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please keep the exported file secure and do not share it with anyone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDataDialogOpen(false)}
              disabled={exportDataLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExportData}
              disabled={exportDataLoading}
            >
              {exportDataLoading ? "Exporting..." : "Export Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
