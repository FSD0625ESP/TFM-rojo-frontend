import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const ICONS = {
  warning: <AlertTriangle className="text-yellow-500 size-5" />,
  error: <XCircle className="text-red-500 size-5" />,
  success: <CheckCircle className="text-green-500 size-5" />,
  info: <Info className="text-blue-500 size-5" />,
};

//modal genérico para mostar mensajes emergentes
export function AlertModal({
  open,
  onClose,
  title = "Alerta",
  message,
  variant = "info", // 'error' | 'warning' | 'success' | 'info'
  actions = [],
}) {
  const Icon = ICONS[variant] || ICONS.info;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex items-center gap-2">
          {Icon}
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {message && (
          <DialogDescription className="text-sm text-muted-foreground">
            {message}
          </DialogDescription>
        )}
        <DialogFooter className="flex justify-end gap-2">
          {actions.map(({ label, onClick, variant = "default" }, index) => (
            <Button key={index} variant={variant} onClick={onClick}>
              {label}
            </Button>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
