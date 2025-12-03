import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function OnboardingLayout({ children }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {} }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/auth");

  const user = session.user;

  // Fetch onboarding state
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_step, is_verified")
    .eq("id", user.id)
    .single();

  // Redirect based on onboarding state
  if (!profile) redirect("/auth");

  if (profile.is_verified) redirect("/dashboard");

  return <>{children}</>;
}
