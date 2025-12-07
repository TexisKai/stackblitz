import { NextResponse } from "next/server";
import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("user_profiles")
    .insert([body]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}

export async function GET() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ data });
}
