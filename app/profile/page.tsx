import ProfileView from "@/components/profile/ProfileView";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return <div className="p-4">Please sign in to view your profile.</div>;
  }

  return <ProfileView userId={data.user.id} />;
}
