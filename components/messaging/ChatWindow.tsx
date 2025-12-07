"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import MessageComposer from "./MessageComposer";

export default function ChatWindow({ otherUserId }: { otherUserId: string }) {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function loadUser() {
    const { data } = await supabase.auth.getSession();
    setUserId(data?.session?.user.id || null);
  }

  async function loadMessages() {
    if (!userId) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  }

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) loadMessages();
  }, [userId]);

  useEffect(() => {
    const channel = supabase
      .channel("chat:" + otherUserId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userId) return <div>Loading chat...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender_id === userId
                ? "text-right"
                : "text-left"
            }
          >
            <div
              className={
                "inline-block px-3 py-2 rounded-lg text-sm " +
                (msg.sender_id === userId
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-neutral-800")
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <MessageComposer otherUserId={otherUserId} />
    </div>
  );
}
