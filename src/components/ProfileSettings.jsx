import { useState } from "react";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { ResponsiveTabsNav } from "./ResponsiveTabsNav";
import { ProfileSetSecurity } from "./ProfileSetSecurity";
import { ProfileSetNotifications } from "./ProfileSetNotifications";
import { ProfileSetAccount } from "./ProfileSetAccount";

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("security");
  const tabItems = [
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
        tabListClassName="grid w-full grid-cols-[1fr_1fr_1fr] sm:grid-cols-3 h-full sm:mb-2"
      />
      {/* Security Settings */}
      <TabsContent value="security" className="space-y-4">
        <ProfileSetSecurity />
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-4">
        <ProfileSetNotifications />
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-4">
        <ProfileSetAccount />
      </TabsContent>
    </Tabs>
  );
}
