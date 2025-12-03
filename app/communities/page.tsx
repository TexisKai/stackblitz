import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function Page() {
  const supabase = createClient();
  const { data, error } = await supabase.from("communities").select("*");

  if (!data) return <div>No communities found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-4">Communities</h1>

      {data.map((c) => (
        <Link
          key={c.id}
          href={\`/communities/\${c.id}\`}
          className="block p-4 bg-white dark:bg-neutral-900 rounded-lg shadow"
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
