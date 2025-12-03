// components/widgets/RecommendedCommunitiesWidget.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import CommunityCard from "@/components/common/CommunityCard";

export default function RecommendedCommunitiesWidget() {
  const supabase = createClient();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCommunities() {
    setLoading(true);

    const { data, error } = await supabase
      .from("communities")
      .select(`
        id,
        name,
        description,
        banner_url,
        community_members(count)
      `)
      .limit(10);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted = data.map((c) => ({
      ...c,
      member_count: c.community_members?.[0]?.count || 0,
    }));

    setCommunities(formatted);
    setLoading(false);
  }

  useEffect(() => {
    loadCommunities();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl">
      <h2 className="font-semibold mb-3">Recommended Communities</h2>
      {loading && <div>Loading...</div>}
      {!loading &&
        communities.map((c) => <CommunityCard key={c.id} community={c} />)}
    </div>
  );
}
