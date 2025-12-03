import AdminDashboard from "@/components/admin/AdminDashboard";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  // server-side: verify admin flag
  const { data: user } = await supabase.auth.getUser();

  // If no user or not admin, return unauthorized message (also middleware blocks most non-authed)
  if (!user?.user) {
    return <div className="p-4">Please sign in to view admin panel.</div>;
  }

  // Server-side fetch profile to check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_admin")
    .eq("id", user.user.id)
    .single();

  if (!profile?.is_admin) {
    return <div className="p-4">Unauthorized — admin access required.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AdminDashboard />
    </div>
  );
}
