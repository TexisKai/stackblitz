"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function AccountSettings() {
  const supabase = createClient();
  const [password, setPassword] = useState("");

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) alert("Error updating password");
    else alert("Password updated");
  }

  return (
    <div className="p-4 border rounded-lg dark:border-neutral-700 space-y-4">
      <h2 className="font-semibold text-lg">Account Settings</h2>

      <div>
        <label className="text-sm">New Password</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mt-1 bg-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={updatePassword}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Update Password
      </button>
    </div>
  );
}
