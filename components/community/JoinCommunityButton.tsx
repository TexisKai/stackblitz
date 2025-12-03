"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function JoinCommunityButton({ communityId }: { communityId: string }) {
  const supabase = createClient();
  const [isMember, setIsMember] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  async function checkMembership() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      setIsMember(false);
      setLoading(false);
      return;
    }

    const userId = session.session.user.id;

    const { data } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", communityId)
      .eq("user_id", userId);

    setIsMember((data || []).length > 0);
    setLoading(false);
  }

  async function join() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return alert("Please login");

    const userId = session.session.user.id;
    setIsMember(true);

    await supabase.from("community_members").insert({
      community_id: communityId,
      user_id: userId,
    });
  }

  async function leave() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return;

    const userId = session.session.user.id;
    setIsMember(false);

    await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", userId);
  }

  useEffect(() => {
    checkMembership();
  }, [communityId]);

  if (loading)
    return <button className="px-3 py-1 text-xs bg-gray-200 rounded">...</button>;

  return isMember ? (
    <button
      onClick={leave}
      className="px-3 py-1 text-xs bg-gray-200 rounded"
    >
      Joined
    </button>
  ) : (
    <button
      onClick={join}
      className="px-3 py-1 text-xs bg-indigo-600 text-white rounded"
    >
      Join
    </button>
  );
}
