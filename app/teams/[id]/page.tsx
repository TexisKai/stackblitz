import { createClient } from "@/lib/supabaseClient";
import TeamInvitePanel from "@/components/teams/TeamInvitePanel";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*, team_members(count)")
    .eq("id", params.id)
    .single();

  if (!team) return <div>Team not found</div>;

  const formatted = {
    ...team,
    member_count: team.team_members?.[0]?.count || 0,
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">{formatted.name}</h1>
      <p className="text-gray-600">{formatted.description}</p>
      <p className="text-sm text-gray-500">{formatted.member_count} members</p>

      <TeamInvitePanel teamId={params.id} />
    </div>
  );
}
