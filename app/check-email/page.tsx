"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CheckEmailPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const pendingEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("pending_du_email")
        : null;

    setEmail(pendingEmail);
  }, []);

  async function resendEmail() {
    if (!email) return;
    setStatus("sending");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (!error) {
      setStatus("sent");
    } else {
      alert("Error resending verification email.");
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>

        <p className="text-gray-600 mb-2">We’ve sent a magic login link to:</p>
        <p className="text-lg font-semibold mb-6">{email || "your email"}</p>

        <div className="border rounded-xl p-5 shadow bg-white">
          <p className="text-gray-700">
            Please check your inbox and click the verification link to continue.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Didn’t receive the email?
          </p>

          <button
            onClick={resendEmail}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
              ? "Email Sent!"
              : "Resend Verification Email"}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Tip: Check spam / promotions folder too.
        </p>
      </div>
    </div>
  );
}
