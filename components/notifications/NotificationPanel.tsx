"use client";

import { useEffect, useState } from "react";
import NotificationItem from "./NotificationItem";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export default function NotificationPanel() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow overflow-hidden">
      <h2 className="p-4 font-semibold border-b dark:border-neutral-700">
        Notifications
      </h2>

      {loading && <div className="p-4 text-sm">Loading...</div>}

      {!loading && items.length === 0 && (
        <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
      )}

      {items.map((n) => (
        <NotificationItem key={n.id} n={n} />
      ))}
    </div>
  );
}
