"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoadingSkeleton, { CardSkeleton } from "@/components/LoadingSkeleton";
import PostCard from "@/components/PostCard";

export default function TrendingPostsWidget() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrendingPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            author:students!posts_student_id_fkey(
              id,
              name,
              college,
              course,
              is_verified
            ),
            likes_count:post_likes(count),
            comments_count:comments(count)
          `)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error("Error loading trending posts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingPosts();
  }, []);

  if (loading) return <CardSkeleton count={3} />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-4">Trending Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}code components/widgets/RecommendedCommunitiesWidget.tsx
