import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmDeleteAccount } from "../services/authService";
import { toast } from "sonner";
import { LogoAndTitle } from "../components/LogoAndTitle.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

//página para confirmar eliminación de cuenta desde el correo
export function DeleteAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing confirmation token. Please request a new account deletion."
      );
    }
  }, [token]);

  const handleConfirmDelete = async () => {
    if (!token) {
      setError("Invalid or missing confirmation token.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await confirmDeleteAccount(token);
      setSuccess(true);
      toast.success("Account deleted successfully ✅");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Error deleting account:", err);
      const message = err.message || "Error deleting account.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoAndTitle />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              {success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Account Deleted
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Confirm Account Deletion
                </>
              )}
            </CardTitle>
            <CardDescription>
              {success
                ? "Your account has been permanently deleted"
                : "This action cannot be undone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your account and all associated data have been permanently
                  deleted. You will be redirected to the login page shortly.
                </p>
              </div>
            ) : !token ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-red-600">
                  Invalid or missing confirmation token. Please request a new
                  account deletion.
                </p>
                <Link
                  to="/login"
                  className="text-sm underline hover:text-primary inline-block"
                >
                  Go back to login
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-destructive mb-2">
                    ⚠️ Warning: This action is irreversible
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By confirming, you will permanently delete:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
                    <li>Your account</li>
                    <li>All your personal data</li>
                    <li>All your statistics and settings</li>
                    <li>All your active sessions</li>
                  </ul>
                </div>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm Account Deletion"}
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-center text-muted-foreground hover:text-foreground block"
                >
                  Cancel and go back to login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

