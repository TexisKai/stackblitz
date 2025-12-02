"use client";

import { useEffect, useState } from "react";
import LoadingSkeleton, { CardSkeleton } from "@/components/LoadingSkeleton";
import { supabase } from "@/lib/supabaseClient";

export default function ActivityWidget() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error: supaError } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (supaError) {
        console.error("ActivityWidget Supabase Error:", supaError.message);
      }

      setActivities(data || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="p-4 border rounded-xl bg-white shadow">
      <h3 className="font-semibold mb-2">Recent Activity</h3>

      {activities.map((a) => (
        <div key={a.id} className="border-b py-2 text-sm">
          {a.description}
        </div>
      ))}
    </div>
  );
}
