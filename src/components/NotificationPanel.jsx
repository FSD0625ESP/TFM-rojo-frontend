import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Check, X, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function NotificationPanel({ open, onOpenChange }) {
    const { notifications, unreadCount, acceptInvitation, rejectInvitation, deleteNotification } =
        useNotifications();

    const pendingNotifications = notifications.filter(
        (n) => n.status === "pending"
    );

    const handleAccept = async (notificationId) => {
        await acceptInvitation(notificationId);
    };

    const handleReject = async (notificationId) => {
        await rejectInvitation(notificationId);
    };

    const handleDelete = async (notificationId) => {
        await deleteNotification(notificationId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="size-5" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-2 flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto mt-4">
                    {pendingNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <Bell className="size-12 mb-4 opacity-50" />
                            <p className="text-sm">No pending notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">
                                                {notification.type === "squad_invitation" &&
                                                    `Squad invitation from ${notification.fromUserId?.userName || "Unknown"}`}
                                                {notification.type === "squad_accepted" &&
                                                    `Squad request accepted by ${notification.fromUserId?.userName || "Unknown"}`}
                                                {notification.type === "squad_rejected" &&
                                                    `Squad request rejected by ${notification.fromUserId?.userName || "Unknown"}`}
                                            </p>
                                            {notification.message && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                            )}
                                            {notification.createdAt && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {dayjs(notification.createdAt).fromNow()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {notification.status === "pending" &&
                                        notification.type === "squad_invitation" && (
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleAccept(notification._id)}
                                                    className="flex-1"
                                                >
                                                    <Check className="size-4 mr-1" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReject(notification._id)}
                                                    className="flex-1"
                                                >
                                                    <X className="size-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}

                                    {notification.status === "pending" &&
                                        notification.type === "squad_accepted" && (
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="flex-1"
                                                >
                                                    <Trash2 className="size-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        )}

                                    {notification.status === "pending" &&
                                        notification.type === "squad_rejected" && (
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(notification._id)}
                                                    className="flex-1"
                                                >
                                                    <Trash2 className="size-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

