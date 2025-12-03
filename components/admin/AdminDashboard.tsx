"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import VerificationApproval from "./VerificationApproval";
import UserModeration from "./UserModeration";

export default function AdminDashboard() {
  const supabase = createClient();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPending() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, email, verification_docs")
      .eq("verified", false)
      .not("verification_docs", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error) setPending(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Approve or reject user verifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Pending Verifications</h3>

          {loading && <div className="text-sm text-gray-500">Loading...</div>}

          {!loading && pending.length === 0 && (
            <div className="text-sm text-gray-500">No pending verifications</div>
          )}

          {pending.map((u) => (
            <div key={u.id} className="p-3 border rounded flex items-start justify-between">
              <div>
                <div className="font-medium">{u.display_name || u.email}</div>
                <div className="text-xs text-gray-500 mt-1">Docs attached</div>
              </div>
              <VerificationApproval user={u} />
            </div>
          ))}
        </div>

        <div>
          <UserModeration />
        </div>
      </div>
    </div>
  );
}
