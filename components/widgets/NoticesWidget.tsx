"use client";

import React, { useEffect, useState } from "react";
import LoadingSkeleton, { CardSkeleton } from "../LoadingSkeleton";
import { supabase } from "@/lib/supabaseClient";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high";
  created_at: string;
}

export default function NoticesWidget() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) console.error("NoticesWidget Error:", error);

      setNotices((data as Notice[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="p-4 border rounded-xl bg-white shadow">
      <h3 className="font-semibold mb-2">Latest Notices</h3>

      {notices.length === 0 ? (
        <p className="text-sm text-gray-500">No notices available.</p>
      ) : (
        notices.map((notice) => (
          <div key={notice.id} className="border-b py-3 text-sm">
            <div className="flex justify-between">
              <strong>{notice.title}</strong>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  notice.priority === "high"
                    ? "bg-red-200 text-red-700"
                    : notice.priority === "medium"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-green-200 text-green-700"
                }`}
              >
                {notice.priority}
              </span>
            </div>

            <p className="text-gray-600 mt-1">{notice.content}</p>

            <div className="text-xs text-gray-400 mt-1">
              {new Date(notice.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
