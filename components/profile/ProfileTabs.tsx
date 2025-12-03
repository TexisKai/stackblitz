"use client";

import { useState } from "react";

export default function ProfileTabs() {
  const [tab, setTab] = useState("posts");

  return (
    <div className="mt-6">
      <div className="flex gap-6 border-b pb-2">
        {["posts", "about", "activity"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-1 ${
              tab === t
                ? "border-b-2 border-indigo-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
