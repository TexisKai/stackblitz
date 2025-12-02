'use client';

interface Step5Props {
  data: any;
  updateData: (updates: any) => void;
}

const TEAMS = [
  {
    name: 'Taleem',
    description: 'Educational initiatives and learning programs',
    icon: '📚',
  },
  {
    name: 'PR Team',
    description: 'Public Relations and communications',
    icon: '📢',
  },
  {
    name: 'Event Management',
    description: 'Organize and manage college events',
    icon: '🎉',
  },
  {
    name: 'Content Team',
    description: 'Create engaging content for the platform',
    icon: '✍️',
  },
  {
    name: 'Social Media Team',
    description: 'Manage social media presence',
    icon: '📱',
  },
  {
    name: 'Volunteering',
    description: 'Community service and volunteer work',
    icon: '🤝',
  },
  {
    name: 'Sports Team',
    description: 'Sports activities and tournaments',
    icon: '⚽',
  },
  {
    name: 'Tech Team',
    description: 'Technical development and innovation',
    icon: '💻',
  },
];

export default function Step5({ data, updateData }: Step5Props) {
  const toggleTeam = (team: string) => {
    const updated = data.teams.includes(team)
      ? data.teams.filter((t: string) => t !== team)
      : [...data.teams, team];
    updateData({ teams: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Join Teams (Optional)
        </h2>
        <p className="text-gray-600">Select teams you want to be part of</p>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800 text-sm">
          ℹ️ You can join or leave teams anytime from your dashboard
        </p>
      </div>

      {/* Teams Grid */}
      <div className="space-y-3">
        {TEAMS.map((team) => (
          <label
            key={team.name}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
              data.teams.includes(team.name)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input
              type="checkbox"
              checked={data.teams.includes(team.name)}
              onChange={() => toggleTeam(team.name)}
              className="w-4 h-4 rounded mt-1"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{team.icon}</span>
                <p className="font-semibold text-gray-900">{team.name}</p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{team.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Counter */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-700 font-medium">Teams Selected</span>
        <span className="text-indigo-600 font-bold text-lg">
          {data.teams.length}
        </span>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-700 text-sm">
          📌 <strong>Note:</strong> Skipping this step is fine. You can join teams later from your dashboard.
        </p>
      </div>
    </div>
  );
}