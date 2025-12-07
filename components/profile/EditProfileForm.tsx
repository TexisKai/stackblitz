"use client";

import { useState } from "react";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export default function EditProfileForm({ profile }: { profile: any }) {
  const supabase = createClient();

  const [form, setForm] = useState({
    display_name: profile.display_name || "",
    bio: profile.bio || "",
    skills: profile.skills || [],
  });

  async function save() {
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("id", profile.id);

    if (error) alert("Error saving profile");
    else alert("Profile updated!");
  }

  return (
    <div className="p-4 border rounded-lg space-y-4 bg-white dark:bg-neutral-900">
      <div>
        <label className="block text-sm font-medium">Display Name</label>
        <input
          className="w-full px-3 py-2 border rounded bg-transparent"
          value={form.display_name}
          onChange={(e) => setForm({ ...form, display_name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea
          className="w-full px-3 py-2 border rounded bg-transparent"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <button
        onClick={save}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
