import { createServerSupabase } from "@/lib/server/supabaseServer";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth");

  return <div>Welcome, {data.user.email}</div>;
}
