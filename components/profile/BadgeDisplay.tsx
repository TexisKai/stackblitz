export default function BadgeDisplay({ badges }: { badges: string[] }) {
  if (!badges.length)
    return (
      <div className="text-gray-500 text-sm mt-4">
        No badges yet.
      </div>
    );

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {badges.map((badge, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
