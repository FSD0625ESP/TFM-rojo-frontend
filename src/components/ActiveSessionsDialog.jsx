import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatRelativeDate } from "../utils/dateUtils";
import { getActiveSessions } from "../services/authService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export function ActiveSessionsDialog({ open, onOpenChange }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getActiveSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      toast.error(err.message || "Error loading sessions ❌");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Active Sessions</DialogTitle>
          <DialogDescription>
            Manage devices that are logged into your account. You can close
            sessions from other devices.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active sessions found
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="capitalize">
                        {session.device}
                      </TableCell>
                      <TableCell>{session.browser}</TableCell>
                      <TableCell>{session.os}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {session.ip}
                      </TableCell>
                      <TableCell>
                        {formatRelativeDate(session.lastActivity)}
                      </TableCell>
                      <TableCell>
                        {session.isCurrentSession ? (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700"
                          >
                            Current
                          </Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

