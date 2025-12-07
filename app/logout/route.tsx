import { createServerSupabase } from "@/lib/server/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect("/auth");
}
