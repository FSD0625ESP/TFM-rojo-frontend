import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { enableTwoFactor, disableTwoFactor } from "../services/authService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function TwoFactorSetup({ isEnabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  const handleToggle = async () => {
    if (isEnabled) {
      //deshabilitar 2FA
      setLoading(true);
      try {
        await disableTwoFactor();
        toast.success("Two-factor authentication disabled ✅");
        await refreshUser();
        onToggle?.(false);
      } catch (err) {
        toast.error(err.message || "Error disabling two-factor ❌");
      } finally {
        setLoading(false);
        setOpen(false);
      }
    } else {
      //mostrar diálogo de confirmación para habilitar
      setOpen(true);
    }
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      await enableTwoFactor();
      toast.success("Two-factor authentication enabled ✅");
      await refreshUser();
      onToggle?.(true);
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Error enabling two-factor ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={
            isEnabled
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }
        >
          {isEnabled ? "Enabled" : "Disabled"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={loading}
        >
          {isEnabled ? "Disable" : "Enable"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              When enabled, you will receive a 6-digit code via email each time
              you log in. This adds an extra layer of security to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnable} disabled={loading}>
              {loading ? "Enabling..." : "Enable 2FA"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

