// THIS IS A SERVER COMPONENT
import { createServerSupabase } from "@/lib/serverServer";

export default async function ActivityWidget() {
  const supabase = await createServerSupabase();

  const { data: activities, error } = await supabase
    .from("activities")
    .select("id, created_at, description, user_id, type")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("ActivityWidget Error:", error);
    return (
      <div className="p-4 text-red-500">Failed to load activities</div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col gap-4">
        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>

        <div className="space-y-4">
          {activities?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description || "No activity description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.created_at
                    ? new Date(activity.created_at).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          ))}

          {(!activities || activities.length === 0) && (
            <p className="text-sm text-muted-foreground">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
