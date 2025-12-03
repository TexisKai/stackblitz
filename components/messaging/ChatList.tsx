"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseBrowser";

export default function ChatList() {
  const supabase = createClient();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadChats() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) return;

    const userId = sessionData.session.user.id;

    const { data, error } = await supabase.rpc("get_chat_list", {
      uid: userId,
    });

    if (!error) setChats(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadChats();
  }, []);

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="space-y-3">
      {chats.length === 0 && <div>No conversations yet</div>}

      {chats.map((chat) => (
        <Link
          key={chat.other_user_id}
          href={"/messages/" + chat.other_user_id}
          className="block p-4 bg-white dark:bg-neutral-900 rounded shadow"
        >
          <div className="font-semibold">{chat.other_user_name}</div>
          <div className="text-xs text-gray-500">{chat.last_message}</div>
        </Link>
      ))}
    </div>
  );
}
