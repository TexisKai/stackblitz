"use client";

import { useOnboarding } from "@/hooks/useOnboarding";
import { createClient } from "@/lib/supabaseBrowser";
import { useEffect, useState } from "react";

export default function Step1() {
  const supabase = createClient();
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
