import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export async function getProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  return { data, error };
}
