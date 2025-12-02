import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const filePath = `uploads/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

  return NextResponse.json({ url: data.publicUrl });
}
