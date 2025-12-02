import { useState } from "react";

export function useOnboarding() {
  const [loading, setLoading] = useState(false);

  async function completeOnboarding(userId: string, formData: any) {
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ userId, profile: formData }),
      headers: { "Content-Type": "application/json" }
    });

    setLoading(false);

    if (!res.ok) throw new Error("Onboarding failed.");
  }

  return { completeOnboarding, loading };
}
