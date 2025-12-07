"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import Link from "next/link";

export default function Page() {
  const supabase = createClient();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      const { data, error } = await supabase
        .from("communities")
        .select("*");

      if (error) {
        console.error(error);
        setCommunities([]);
      } else {
        setCommunities(data || []);
      }

      setLoading(false);
    }

    loadCommunities();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (communities.length === 0) return <div>No communities found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-4">Communities</h1>

      {communities.map((c) => (
        <Link
          key={c.id}
          href={`/communities/${c.id}`}
          className="block p-4 bg-white dark:bg-neutral-900 rounded-lg shadow"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
