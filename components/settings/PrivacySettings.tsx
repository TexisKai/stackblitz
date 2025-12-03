"use client";

import { useState } from "react";

export default function PrivacySettings() {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="p-4 border rounded-lg dark:border-neutral-700 space-y-4">
      <h2 className="font-semibold text-lg">Privacy Settings</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <span className="text-sm">Make Profile Public</span>
      </label>
    </div>
  );
}
