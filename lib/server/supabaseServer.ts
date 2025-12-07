import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server Supabase factory for Next.js App Router (Server Component / API routes).
 * Usage: const supabase = await createServerSupabase();
 */
export async function createServerSupabase() {
  const cookieStore = cookies(); // note: cookies() returns a RequestCookies-like object in App Router
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  );
}
