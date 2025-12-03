"use client";

import { useRouter } from "next/navigation";

export function useOnboarding(step: number) {
  const router = useRouter();

  return {
    next: () => router.push(`/onboarding/step-${step + 1}`),
    prev: () => router.push(`/onboarding/step-${step - 1}`),
    finish: () => router.push("/auth/verify"),
  };
}
