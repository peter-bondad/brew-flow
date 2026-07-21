import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "./account-settings";
import { AppearanceSettings } from "./appearance-settings";
import { SettingsCard } from "./settings-card";
import { StoreSettings } from "./store-settings";

const triggerClass = `
cursor-pointer
rounded-xl
px-4
py-2
font-medium
text-[#8b5e34]
transition-all
duration-200

hover:bg-[#f8efe4]
hover:text-[#4a2c1a]

data-[state=active]:bg-[#f4e2cd]
data-[state=active]:text-[#4a2c1a]
`;
export function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="space-y-8">
      <TabsList
        variant="line"
        className=" w-full justify-start overflow-x-auto gap-8 border-b border-[#e4c9a7] bg-transparent"
      >
        <TabsTrigger value="account" className={triggerClass}>
          Account
        </TabsTrigger>

        <TabsTrigger value="appearance" className={triggerClass}>
          Appearance
        </TabsTrigger>

        <TabsTrigger value="store" className={triggerClass}>
          Store
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <AccountSettings />
      </TabsContent>

      <TabsContent value="appearance">
        <SettingsCard
          title="Appearance"
          description="Customize your BrewFlow interface."
        >
          <AppearanceSettings />
        </SettingsCard>
      </TabsContent>

      <TabsContent value="store">
        <SettingsCard
          title="Store Settings"
          description="Manage your coffee shop information."
        >
          <StoreSettings />
        </SettingsCard>
      </TabsContent>
    </Tabs>
  );
}
