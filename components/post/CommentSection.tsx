// components/post/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  author: {
    id: string;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export default function CommentSection({ postId }: { postId: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  async function loadComments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("post_comments")
      .select(
        `
        id,
        body,
        created_at,
        author:profiles(id, display_name, avatar_url)
        `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formatted: Comment[] = (data || []).map((c: any) => ({
      id: c.id,
      body: c.body,
      created_at: c.created_at,
      author: c.author ? {
        id: c.author.id,
        display_name: c.author.display_name,
        avatar_url: c.author.avatar_url
      } : null,
    }));

    setComments(formatted);
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  async function submitComment() {
    if (!newComment.trim()) return;

    setPosting(true);

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      alert("Please sign in to comment");
      setPosting(false);
      return;
    }

    const userId = session.session.user.id;

    const optimistic: Comment = {
      id: "temp-" + Date.now(),
      body: newComment,
      created_at: new Date().toISOString(),
      author: {
        id: userId,
        display_name: "You",
        avatar_url: null,
      },
    };

    setComments((prev) => [...prev, optimistic]);
    setNewComment("");

    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: userId,
      body: optimistic.body,
    });

    if (error) {
      console.error(error);
      alert("Failed to post comment");
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    } else {
      loadComments();
    }

    setPosting(false);
  }

  return (
    <div className="mt-4 border-t pt-3">
      {loading ? (
        <div className="text-sm text-gray-500">Loading comments...</div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                {c.author?.avatar_url ? (
                  <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
                    {c.author?.display_name?.charAt(0) ?? "U"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-medium">
                  {c.author?.display_name ?? "Unknown"}
                </div>
                <div className="text-sm">{c.body}</div>
                <div className="text-xs text-gray-400">
                  {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button
          onClick={submitComment}
          disabled={posting}
          className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
