import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost } from "lucide-react"; // ícono simpático

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <Card className="max-w-md w-full bg-muted/40">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Ghost className="w-12 h-12 text-primary animate-bounce" />
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            We're sorry, we couldn't find the page you're looking for.
          </p>
          <Button
            variant="default"
            onClick={() => (window.location.href = "/start/statistics")}
          >
            Return to start screen.
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
