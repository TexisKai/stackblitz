'use client';

interface Step4Props {
  data: any;
  updateData: (updates: any) => void;
}

const SKILLS = [
  'Video Editing',
  'Content Writing',
  'Programming',
  'Public Speaking',
  'Designing',
  'Management',
  'Marketing',
  'Excel',
  'SQL',
  'Python',
  'Finance',
  'Photography',
  'Data Analysis',
  'Event Planning',
  'Social Media',
  'Graphic Design',
];

export default function Step4({ data, updateData }: Step4Props) {
  const toggleSkill = (skill: string) => {
    const updated = data.skills.includes(skill)
      ? data.skills.filter((s: string) => s !== skill)
      : [...data.skills, skill];
    updateData({ skills: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Skills
        </h2>
        <p className="text-gray-600">Choose at least 1 skill</p>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🎯 Skills help you connect with relevant projects and teams
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SKILLS.map((skill) => (
          <label
            key={skill}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              data.skills.includes(skill)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input
              type="checkbox"
              checked={data.skills.includes(skill)}
              onChange={() => toggleSkill(skill)}
              className="w-4 h-4 rounded"
            />
            <span className="ml-3 text-gray-700 font-medium">{skill}</span>
          </label>
        ))}
      </div>

      {/* Counter */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-700 font-medium">Skills Selected</span>
        <span className="text-indigo-600 font-bold text-lg">
          {data.skills.length} / {SKILLS.length}
        </span>
      </div>

      {/* Validation Message */}
      {data.skills.length < 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please select at least 1 skill to continue
          </p>
        </div>
      )}
    </div>
  );
}