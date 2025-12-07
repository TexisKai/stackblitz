"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import { useEffect, useState } from "react";

export default function Step1() {
  const { next } = useOnboarding(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/auth";
      setLoading(false);
    });
  }, []);

  if (loading) return "Loading...";

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Basic Details</h1>

      {/* your form here */}

      <button
        onClick={next}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Continue →
      </button>
    </div>
  );
}
