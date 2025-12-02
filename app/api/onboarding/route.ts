import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, profile } = body;

  const { error } = await supabase
    .from("user_profiles")
    .upsert({ user_id: userId, ...profile });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}
