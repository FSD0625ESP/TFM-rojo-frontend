import { useState } from "react";
import { Shield, Key, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ResponsiveTabsNav } from "./ResponsiveTabsNav";
import { useAuth } from "../context/AuthContext";

export function ProfileContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("summoner");
  const tabItems = [
    { label: "Summoner", value: "summoner", private: false },
    { label: "Personal", value: "personal", private: false },
    { label: "Security", value: "security", private: false },
    { label: "Notifications", value: "notifications", private: false },
    { label: "Account", value: "account", private: false },
  ];
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {/* Header: navegación adaptable */}
      <ResponsiveTabsNav
        items={tabItems}
        activeTab={activeTab}
        onChange={setActiveTab}
        navigateToRoute={false}
        basePath=""
        tabListClassName="grid w-full grid-cols-[1fr_1fr_1fr_1fr_auto] sm:grid-cols-5 h-full sm:mb-2"
      />

      {/* Summoner Information */}
      <TabsContent value="summoner" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Summoner</CardTitle>
            <CardDescription>
              Power information and your summoner's data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="champion">Most Played Champion</Label>
                <Input
                  className="bg-muted"
                  id="champion"
                  defaultValue={user?.lolStats?.champion || ""}
                  readOnly
                  placeholder="Aatrox"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="winRate">Win Rate</Label>
                <Input
                  className="bg-muted"
                  id="winRate"
                  defaultValue={user?.lolStats?.winRate || ""}
                  readOnly
                  placeholder="50%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="matchesPlayed">Matches Played</Label>
                <Input
                  className="bg-muted"
                  id="matchesPlayed"
                  defaultValue={user?.lolStats?.matchesPlayed || ""}
                  readOnly
                  placeholder="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kills">Kills</Label>
                <Input
                  id="kills"
                  defaultValue={user?.lolStats?.kills || ""}
                  className="bg-muted"
                  readOnly
                  placeholder="65%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deaths">Deaths</Label>
                <Input
                  className="bg-muted"
                  id="deaths"
                  defaultValue={user?.lolStats?.deaths || ""}
                  readOnly
                  placeholder="25%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Assists</Label>
                <Input
                  className="bg-muted"
                  id="assists"
                  defaultValue={user?.lolStats?.assists || ""}
                  readOnly
                  placeholder="45%"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="queue">Queue</Label>
                <Input
                  className="bg-muted"
                  id="queue"
                  defaultValue={user?.lolProfile?.queue || ""}
                  readOnly
                  placeholder="Ranked Flex 5v5"
                />
              </div>
              <Label htmlFor="mySquad">My Squad</Label>
              <Input
                className="bg-muted"
                id="mySquad"
                defaultValue={user?.lolProfile?.mySquad || ""}
                readOnly
                placeholder="Nexxus Squad"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

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

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Password</Label>
                  <p className="text-muted-foreground text-sm">
                    Last changed 3 months ago
                  </p>
                </div>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700"
                  >
                    Disabled
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Login Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch defaultChecked={false} id="loginNotifications" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Active Sessions</Label>
                  <p className="text-muted-foreground text-sm">
                    Manage devices that are logged into your account
                  </p>
                </div>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what notifications you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive notifications via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-muted-foreground text-sm">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Important security notifications (always enabled)
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Subscription Plan</Label>
                <p className="text-muted-foreground text-sm">
                  Free Plan - Limited Access
                </p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Visibility</Label>
                <p className="text-muted-foreground text-sm">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Data Export</Label>
                <p className="text-muted-foreground text-sm">
                  Download a copy of your data
                </p>
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>

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
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
