import { SettingsTabs } from "./components/settings-tab";

export default function SettingsPage() {
  return (
    <main
      className="
        min-h-auto
        bg-[linear-gradient(135deg,#f8efe7_0%,#f4e0c8_55%,#e8c79d_100%)]
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#4a2c1a]">Settings</h1>

          <p className="mt-2 text-sm text-[#8b5e34]">
            Manage your account and BrewFlow preferences.
          </p>
        </div>

        <SettingsTabs />
      </div>
    </main>
  );
}
