"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signupWithDUEmail, loginMagicLink } from "@/lib/auth";
import { isDUStudentEmail, detectStudentEmailPattern } from "@/lib/validators";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  // ---------------------------
  // RESTORE SAVED EMAIL
  // ---------------------------
  useEffect(() => {
    const savedEmail = localStorage.getItem("saved_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // ---------------------------
  // LIVE EMAIL VALIDATION
  // ---------------------------
  useEffect(() => {
    if (!email) return setHint(null);

    const lower = email.toLowerCase();

    if (detectStudentEmailPattern(lower)) {
      setHint("✔ DU student email format detected");
    } else {
      setHint("⚠ Must contain roll_no + year + college pattern");
    }
  }, [email]);

  // ---------------------------
  // HANDLE FORM SUBMIT
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setHint(null);
    setLoading(true);
    setSending(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isDUStudentEmail(normalizedEmail)) {
        throw new Error(
          "Only DU student roll-number emails are allowed. Teacher/Staff emails are blocked."
        );
      }

      if (isLogin) {
        await loginMagicLink(normalizedEmail);
      } else {
        await signupWithDUEmail(normalizedEmail, fullName);
      }

      localStorage.setItem("saved_email", normalizedEmail);

      router.push("/auth/verify");
      router.refresh();
    } catch (err: any) {
      console.error("AUTH ERROR:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSending(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">MyCollege</h1>
          <p className="text-gray-600">Delhi University Student Platform</p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* LIVE HINT */}
        {hint && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
            <p className="text-blue-700 text-sm">{hint}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME FIELD */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-purple-500 text-gray-900"
                required
              />
            </div>
          )}

          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DU Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.toLowerCase().trim())
              }
              placeholder="1033_22@aurobindo.du.ac.in"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-purple-500 text-gray-900"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition
            ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {sending
              ? "Sending Magic Link…"
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* SWITCH LOGIN / SIGNUP */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-semibold ml-2 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
