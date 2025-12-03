"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function TeamInvitePanel({ teamId }: { teamId: string }) {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  async function sendInvite() {
    if (!email.includes("@")) return alert("Enter a valid email");

    const { error } = await supabase.from("team_invites").insert({
      team_id: teamId,
      email,
    });

    if (error) alert("Error sending invite");
    else alert("Invite sent!");
  }

  return (
    <div className="p-4 border rounded-lg dark:border-neutral-700 bg-white dark:bg-neutral-900 space-y-4 mt-4">
      <h3 className="font-semibold text-lg">Invite Members</h3>

      <input
        className="w-full px-3 py-2 border rounded bg-transparent"
        placeholder="Enter email to invite"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={sendInvite}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Send Invite
      </button>
    </div>
  );
}
