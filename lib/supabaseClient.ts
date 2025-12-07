/**
 * Compatibility: expose named exports some modules expect.
 * Prefer using createClient() from lib/supabaseBrowser and createServerSupabase() from lib/server/supabaseServer.
 */
export { createClient } from "./supabaseBrowser";
export { createServerSupabase } from "./server/supabaseServer";
