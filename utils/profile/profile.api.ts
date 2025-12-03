import { createClient } from "@/utils/supabase/client";

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
