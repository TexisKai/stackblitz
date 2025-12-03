import { createServerSupabase } from '@/lib/supabaseClient'
import type { Database } from '@/lib/types'

type Activity = Database['public']['Tables']['activities']['Row']

export async function ActivityWidget() {
  // 1. Init Server Client
  const supabase = await createServerSupabase()

  // 2. Fetch Data Directly (Server-side)
  const { data: activities, error } = await supabase
    .from('activities')
    .select('id, created_at, description, user_id, type')
    .order('created_at', { ascending: false })
    .limit(5)

  // 3. Handle Errors Gracefully
  if (error) {
    console.error('ActivityWidget Error:', error.message)
    return <div className="p-4 text-red-500">Failed to load activities</div>
  }

  // 4. Render
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col gap-4">
        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
        
        <div className="space-y-4">
          {(activities as Activity[])?.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.description || 'New activity recorded'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : ''}
                </p>
              </div>
            </div>
          ))}
          
          {(!activities || activities.length === 0) && (
            <p className="text-sm text-muted-foreground">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
