import Link from "next/link";

export default function TeamCard({ team }: { team: any }) {
  return (
    <Link
      href={"/teams/" + team.id}
      className="block p-4 bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
    >
      <h2 className="text-lg font-semibold">{team.name}</h2>
      <p className="text-sm text-gray-600">{team.description}</p>
      <p className="text-xs text-gray-500 mt-1">{team.member_count} members</p>
    </Link>
  );
}
