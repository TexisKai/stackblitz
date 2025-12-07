import { createClient } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityFeed from "@/components/community/CommunityFeed";
import JoinCommunityButton from "@/components/community/JoinCommunityButton";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: community } = await supabase
    .from("communities")
    .select("*, community_members(count)")
    .eq("id", params.id)
    .single();

  if (!community) return <div>Community not found</div>;

  const formatted = {
    ...community,
    member_count: community.community_members?.[0]?.count || 0,
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <CommunityHeader community={formatted} />
      <JoinCommunityButton communityId={params.id} />
      <h2 className="text-lg font-semibold mt-4">Posts</h2>
      <CommunityFeed communityId={params.id} />
    </div>
  );
}
