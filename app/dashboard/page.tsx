import React from "react";
import ActivityWidget from "@/components/widgets/ActivityWidget";
import ClubsWidget from "@/components/widgets/ClubsWidget";
import NoticesWidget from "@/components/widgets/NoticesWidget";

export const metadata = {
  title: "Dashboard - MyCollege",
};

export default function DashboardPage() {
  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 columns */}
        <div className="md:col-span-2 space-y-6">
          <NoticesWidget />
          <ActivityWidget />
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <ClubsWidget />

          <div className="p-4 border rounded-xl bg-white shadow">
            <h3 className="font-semibold mb-2">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-gray-50 rounded">Users: <strong>--</strong></div>
              <div className="p-2 bg-gray-50 rounded">Notices: <strong>--</strong></div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
