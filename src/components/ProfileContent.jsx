import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";

export function ProfileContent() {
  const { user } = useAuth();
  return (
    <Tabs defaultValue="personal">
      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  className="bg-muted"
                  id="firstName"
                  defaultValue={user?.contact?.name || ""}
                  readOnly
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  className="bg-muted"
                  id="lastName"
                  defaultValue={user?.contact?.lastName || ""}
                  readOnly
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  className="bg-muted"
                  readOnly
                  placeholder="summoner@lolmatch.online"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  className="bg-muted"
                  id="phone"
                  defaultValue={user?.contact?.phone || ""}
                  readOnly
                  placeholder="+34 678-1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  className="bg-muted"
                  id="city"
                  defaultValue={user?.address?.city || ""}
                  readOnly
                  placeholder="Berlin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  className="bg-muted"
                  id="country"
                  defaultValue={user?.address?.country || ""}
                  readOnly
                  placeholder="Germany"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="discord">Discord</Label>
                <Input
                  className="bg-muted"
                  id="discord"
                  defaultValue={user?.contact?.discord || ""}
                  readOnly
                  placeholder="https://discord.com/users/123456789"
                />
              </div>
              <Label htmlFor="hobbies">Hobbies</Label>
              <Input
                className="bg-muted"
                id="hobbies"
                defaultValue=""
                readOnly
                placeholder="Playing video games"
              />
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  defaultValue=""
                  rows={6}
                  className="bg-muted resize-none"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
