import { Settings } from "lucide-react";
import { SettingsTabs } from "./components/settings-tab";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <Settings className="size-6" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#f7d8b2]">
              Account
            </p>

            <h1 className="mt-1 text-3xl font-semibold">
              Settings & Preferences
            </h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm text-[#f7e9d8]">
          Manage your profile, security, appearance, and store preferences from
          one place.
        </p>
      </section>

      <SettingsTabs />
    </div>
  );
}
