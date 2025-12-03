"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";
import PostCard from "@/components/common/PostCard";

export default function CommunityFeed({ communityId }: { communityId: string }) {
  const supabase = createClient();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(\`
        id,
        content,
        image_url,
        created_at,
        author:profiles(id, display_name, avatar_url),
        likes:post_likes(count),
        comments:post_comments(count)
      \`)
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted = (data || []).map((p) => ({
      ...p,
      likes_count: p.likes?.[0]?.count || 0,
      comments_count: p.comments?.[0]?.count || 0,
    }));

    setPosts(formatted);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="space-y-4">
      {posts.length === 0 && <div>No posts yet</div>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
