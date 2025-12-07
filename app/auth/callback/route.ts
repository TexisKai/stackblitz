// app/auth/callback/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/server/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/onboarding";

  if (!code) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const supabase = await createServerSupabase();

    // 1️⃣ Exchange Auth Code for Session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Session exchange error:", sessionError);
      return NextResponse.redirect(
        new URL("/auth?error=session_failed", request.url)
      );
    }

    const user = sessionData?.user;
    if (!user) {
      return NextResponse.redirect(
        new URL("/auth?error=no_user_found", request.url)
      );
    }

    // 2️⃣ Check if student already exists (safe: no .single() crash)
    const { data: existingStudents, error: lookupError } = await supabase
      .from("students")
      .select("id, onboarding_complete")
      .eq("auth_id", user.id)
      .limit(1);

    if (lookupError) {
      console.error("Student lookup error:", lookupError);
    }

    const exists = existingStudents && existingStudents.length > 0;

    // 3️⃣ Auto-create student record for first-time login
    if (!exists) {
      const { error: insertError } = await supabase
        .from("students")
        .insert(
          {
            auth_id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || null,
            onboarding_complete: false,

            // Empty placeholders so onboarding can fill them
            college: null,
            course: null,
            year: null,
            du_id_url: null,
            interests: [],
            skills: [],
            teams: [],
          } as any // fixes TypeScript table type inference
        );

      if (insertError) {
        console.error("Student creation error:", insertError);
        // do NOT break login; continue
      }
    }

    // 4️⃣ Redirect safely
    // Prevent redirecting to external websites (security)
    const base = new URL(request.url);

    let target;
    try {
      const test = new URL(next, base);
      target = test; // safe internal redirect
    } catch {
      target = new URL("/onboarding", base);
    }

    return NextResponse.redirect(target);
  } catch (err) {
    console.error("Callback Fatal Error:", err);
    return NextResponse.redirect(
      new URL("/auth?error=callback_exception", request.url)
    );
  }
}
