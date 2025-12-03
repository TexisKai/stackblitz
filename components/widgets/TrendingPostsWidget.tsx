// components/widgets/TrendingPostsWidget.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import PostCard from "@/components/common/PostCard";

export default function TrendingPostsWidget() {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        created_at,
        author:profiles(id, display_name, avatar_url),
        likes:post_likes(count),
        comments:post_comments(count)
      `);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted = data.map((p) => ({
      ...p,
      likes_count: p.likes?.[0]?.count || 0,
      comments_count: p.comments?.[0]?.count || 0,
    }));

    setPosts(formatted);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl">
      <h2 className="font-semibold mb-3">Trending Posts</h2>
      {loading && <div>Loading...</div>}
      {!loading && posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
