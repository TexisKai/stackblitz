"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DeviceManagement() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<any[]>([]);

  async function loadSessions() {
    const { data } = await supabase.auth.getSession();
    if (data?.session) setSessions([data.session]);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="p-4 border rounded-lg dark:border-neutral-700 space-y-4">
      <h2 className="font-semibold text-lg">Device Management</h2>

      {sessions.map((s, i) => (
        <div key={i} className="text-sm p-2 bg-gray-100 dark:bg-neutral-800 rounded">
          Logged in as: {s.user.email}
        </div>
      ))}
    </div>
  );
}
