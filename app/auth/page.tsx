"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");

  const sendMagicLink = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) alert(error.message);
    else window.location.href = "/check-email";
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <input
        type="email"
        name="email"
        autoComplete="email username"
        placeholder="Enter DU Email"
        className="border w-full p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={sendMagicLink}
        className="bg-black text-white w-full p-2 rounded"
      >
        Send Magic Link
      </button>
    </div>
  );
}
