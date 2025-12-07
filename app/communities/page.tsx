import { createClient } from "@/lib/supabaseBrowser";
import Link from "next/link";

export default async function Page() {
  // This file will run as a server component. For server-side fetching, prefer createServerSupabase.
  // If you want client-side dynamic behavior, move this to a client component.
  const supabase = createClient();
  const { data, error } = await supabase.from("communities").select("*");

  if (!data || data.length === 0) return <div>No communities found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-4">Communities</h1>

      {data.map((c: any) => (
        <Link
          key={c.id}
          href={`/communities/${c.id}`}
          className="block p-4 bg-white dark:bg-neutral-900 rounded-lg shadow"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
