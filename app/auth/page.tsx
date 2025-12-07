"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function AuthPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  async function login() {
    const opts = { email, password };
    const { error } = await supabase.auth.signInWithPassword(opts);
    if (error) return alert(error.message);
    // If 'remember' is checked, backend/session handling should extend cookie expiration — handled server-side.
    // Redirect or reload page to reflect signed-in state.
    window.location.href = "/";
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        Keep me logged in
      </label>

      <button onClick={login} className="bg-blue-600 text-white p-2 w-full rounded">
        Sign in
      </button>
    </div>
  );
}
