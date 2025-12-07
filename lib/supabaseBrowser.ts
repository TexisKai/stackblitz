import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase factory for App Router client components.
 * Usage: import { createClient } from "@/lib/supabaseBrowser"; const supabase = createClient()
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
