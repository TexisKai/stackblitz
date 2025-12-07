import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const userId = form.get("userId") as string;

  if (!file || !userId) {
    return new Response("Missing file or userId", { status: 400 });
  }

  const filePath = `${userId}/${Date.now()}-${file.name}`;

  await supabase.storage.from("id_cards").upload(filePath, file);

  const url = supabase.storage.from("id_cards").getPublicUrl(filePath).data.publicUrl;

  return new Response(JSON.stringify({ url }), { status: 200 });
}
