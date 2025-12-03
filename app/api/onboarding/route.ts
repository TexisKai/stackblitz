import { createServerClient } from "@supabase/ssr";

export async function POST(req) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {} }
  );

  const body = await req.json();

  const {
    user_id,
    step,
    name,
    course,
    year,
    phone,
    bio,
  } = body;

  const { error } = await supabase.from("profiles").upsert({
    id: user_id,
    onboarding_step: step,
    name,
    course,
    year,
    phone,
    bio,
  });

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json({ ok: true });
}
