import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("member_count", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
