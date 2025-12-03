"use client";

import { useEffect, useState } from "react";
import LoadingSkeleton, { CardSkeleton } from "@/components/LoadingSkeleton";
import { createClient } from "@/lib/supabaseBrowser";

export default function ClubsWidget() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error: supaError } = await supabase
        .from("clubs")
        .select("*")
        .order("member_count", { ascending: false })
        .limit(5);

      if (supaError) {
        console.error("ClubsWidget Supabase Error:", supaError.message);
      }

      setClubs(data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="p-4 border rounded-xl bg-white shadow">
      <h3 className="font-semibold mb-2">Popular Clubs</h3>

      {clubs.map((club) => (
        <div key={club.id} className="border-b py-2 text-sm">
          <strong>{club.name}</strong> — {club.member_count} members
        </div>
      ))}
    </div>
  );
}
