"use client";
import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import { useState } from "react";
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const sendMagicLink = async () => {
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
        autoComplete="email"
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
