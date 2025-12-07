"use client";

import { useState } from "react";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export default function MessageComposer({ otherUserId }: { otherUserId: string }) {
  const supabase = createClient();
  const [text, setText] = useState("");

  async function sendMessage() {
    if (!text.trim()) return;

    const { data } = await supabase.auth.getSession();
    if (!data?.session) return alert("Please login");

    const userId = data.session.user.id;

    await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: otherUserId,
      content: text,
    });

    setText("");
  }

  return (
    <div className="p-3 border-t dark:border-neutral-700 flex gap-2 bg-white dark:bg-neutral-900">
      <input
        className="flex-1 px-3 py-2 border rounded bg-transparent"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}
