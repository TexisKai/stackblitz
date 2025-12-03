// components/post/ImageUploader.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function ImageUploader({
  onUpload,
}: {
  onUpload: (url: string | null) => void;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("post-media")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed");
      setLoading(false);
      return;
    }

    // Retrieve public URL (no error in new SDK)
    const { data } = supabase.storage
      .from("post-media")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    onUpload(publicUrl);
    setLoading(false);
  }

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-600">
      <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <span className="px-3 py-1 rounded-md border">
        {loading ? "Uploading..." : "Attach Image"}
      </span>
    </label>
  );
}
