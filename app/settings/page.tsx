import AccountSettings from "@/components/settings/AccountSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import DeviceManagement from "@/components/settings/DeviceManagement";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      <AccountSettings />
      <PrivacySettings />
      <DeviceManagement />
    </div>
  );
}
