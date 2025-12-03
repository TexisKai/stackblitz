export default function SkillsDisplay({ skills }: { skills: string[] }) {
  if (!skills.length)
    return (
      <div className="text-gray-500 text-sm mt-4">
        No skills added.
      </div>
    );

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
