"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export default function UserModeration() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email, verified, banned")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error) setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function toggleBan(userId: string, shouldBan: boolean) {
    const { error } = await supabase
      .from("profiles")
      .update({ banned: shouldBan })
      .eq("id", userId);

    if (error) {
      console.error(error);
      alert("Could not update ban status");
    } else {
      loadUsers();
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">User Moderation</h2>

      {loading && <div className="text-sm text-gray-500">Loading users...</div>}

      {!loading && users.length === 0 && (
        <div className="text-sm text-gray-500">No users found</div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="font-medium">{u.display_name || u.email}</div>
              <div className="text-xs text-gray-500">
                {u.email} • {u.verified ? "Verified" : "Unverified"}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleBan(u.id, !u.banned)}
                className={`px-3 py-1 rounded text-sm ${u.banned ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}
              >
                {u.banned ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
