"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function VerificationApproval({ user }: { user: any }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function approve() {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ verified: true })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("Unable to approve.");
    } else {
      alert("User approved.");
      window.location.reload();
    }
    setLoading(false);
  }

  async function reject() {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ verified: false, verification_reason: "Rejected by admin" })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("Unable to reject.");
    } else {
      alert("User rejected.");
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={approve}
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white rounded text-sm"
      >
        {loading ? "..." : "Approve"}
      </button>
      <button
        onClick={reject}
        disabled={loading}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
      >
        {loading ? "..." : "Reject"}
      </button>
    </div>
  );
}
