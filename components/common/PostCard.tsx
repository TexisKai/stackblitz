// components/common/PostCard.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import CommentSection from "@/components/post/CommentSection";

export default function PostCard({ post }) {
  const supabase = createClient();
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  async function checkLike() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return;

    const userId = session.session.user.id;

    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", userId);

    setLiked((data || []).length > 0);
  }

  if (!liked) checkLike();

  async function toggleLike() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return alert("Sign in to like posts");

    const userId = session.session.user.id;

    if (liked) {
      setLiked(false);
      setLikes((l) => l - 1);

      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);
    } else {
      setLiked(true);
      setLikes((l) => l + 1);

      await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id: userId,
      });
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
          <img
            src={post.author?.avatar_url || ""}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
          />
        </div>

        <div className="flex-1">
          <div className="text-sm font-medium">
            {post.author?.display_name || "Unknown User"}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </div>

          <div className="mt-3 text-sm">{post.content}</div>

          {post.image_url && (
            <img
              src={post.image_url}
              className="w-full rounded-md mt-3"
              alt="post"
            />
          )}

          <div className="mt-3 flex items-center gap-4 text-gray-600">
            <button onClick={toggleLike} className="flex items-center gap-2">
              ❤️ {likes}
            </button>
            <button
              onClick={() => setCommentsVisible((v) => !v)}
              className="flex items-center gap-2"
            >
              💬 {post.comments_count || 0}
            </button>
          </div>

          {commentsVisible && <CommentSection postId={post.id} />}
        </div>
      </div>
    </div>
  );
}
