import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/auth/error?reason=no_code");
  }

  // Verify magic link
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Magic link callback error:", error);
    return NextResponse.redirect("/auth/error?reason=auth_failed");
  }

  // Redirect to onboarding if first time
  return NextResponse.redirect("/onboarding");
}
