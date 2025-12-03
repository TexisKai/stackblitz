// components/post/PostComposer.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import ImageUploader from "@/components/post/ImageUploader";

export default function PostComposer({ onPosted }: { onPosted?: () => void }) {
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  async function submitPost() {
    if (!content.trim() && !imageUrl) {
      return alert("Write something or attach an image");
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      return alert("Please sign in to post");
    }
    const userId = session.session.user.id;

    setUploading(true);
    const { error } = await supabase.from("posts").insert({
      user_id: userId,
      content,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("create post:", error);
      alert("Could not create post");
    } else {
      setContent("");
      setImageUrl(null);
      if (onPosted) onPosted();
    }

    setUploading(false);
  }

  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-sm">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with your college..."
        className="w-full min-h-[80px] border rounded-md p-2 text-sm"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <ImageUploader onUpload={(url) => setImageUrl(url)} />
        <div className="flex items-center gap-2">
          <button onClick={submitPost} disabled={uploading} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            {uploading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="preview" className="max-w-full rounded-md" />
        </div>
      )}
    </div>
  );
}
