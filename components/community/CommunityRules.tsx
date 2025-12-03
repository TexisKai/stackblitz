export default function CommunityRules({ rules }: { rules: string[] }) {
  if (!rules.length)
    return <div className="text-gray-500 text-sm">No rules added yet.</div>;

  return (
    <ul className="list-disc ml-5 text-sm space-y-1">
      {rules.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  );
}
