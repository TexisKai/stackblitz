"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function TeamCreateForm() {
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", description: "" });

  async function createTeam() {
    if (!form.name.trim()) return alert("Team name required");

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return alert("Please login");

    const userId = session.session.user.id;

    const { error } = await supabase.from("teams").insert({
      name: form.name,
      description: form.description,
      creator_id: userId,
    });

    if (error) alert("Error creating team");
    else alert("Team created!");
  }

  return (
    <div className="p-4 border rounded-lg dark:border-neutral-700 bg-white dark:bg-neutral-900 space-y-4">
      <h2 className="text-lg font-semibold">Create a Team</h2>

      <div>
        <label className="text-sm">Team Name</label>
        <input
          className="w-full px-3 py-2 border rounded bg-transparent"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm">Description</label>
        <textarea
          className="w-full px-3 py-2 border rounded bg-transparent"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <button
        onClick={createTeam}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Create Team
      </button>
    </div>
  );
}
