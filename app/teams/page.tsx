import { createClient } from "@/lib/supabaseClient";
import TeamCard from "@/components/teams/TeamCard";
import TeamCreateForm from "@/components/teams/TeamCreateForm";

export default async function Page() {
  const supabase = createClient();
  const { data: teams } = await supabase
    .from("teams")
    .select("*, team_members(count)");

  const formatted = (teams || []).map((t) => ({
    ...t,
    member_count: t.team_members?.[0]?.count || 0,
  }));

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Teams</h1>

      <TeamCreateForm />

      <div className="space-y-3 mt-6">
        {formatted.map((t) => (
          <TeamCard key={t.id} team={t} />
        ))}
      </div>
    </div>
  );
}
