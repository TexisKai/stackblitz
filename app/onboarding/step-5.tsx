"use client";

import { useMemo, useState } from "react";

interface Step5Props {
  data: any;
  updateData: (updates: any) => void;
}

const TEAM_CATEGORIES = {
  "🎓 Academics": [
    {
      name: "Taleem",
      description: "Educational initiatives & academic assistance",
      icon: "📚",
    },
  ],
  "📢 Media & Communication": [
    {
      name: "PR Team",
      description: "Public relations & communication team",
      icon: "📢",
    },
    {
      name: "Content Team",
      description: "Create engaging written & video content",
      icon: "✍️",
    },
    {
      name: "Social Media Team",
      description: "Manage college app's social presence",
      icon: "📱",
    },
  ],
  "🎉 Events & Management": [
    {
      name: "Event Management",
      description: "Plan & organize major DU events",
      icon: "🎉",
    },
  ],
  "🤝 Volunteering & Outreach": [
    {
      name: "Volunteering",
      description: "Community service & outreach programs",
      icon: "🤝",
    },
  ],
  "⚽ Sports & Fitness": [
    {
      name: "Sports Team",
      description: "Participate in sports & inter-college tournaments",
      icon: "⚽",
    },
  ],
  "💻 Tech & Innovation": [
    {
      name: "Tech Team",
      description: "Technical development & innovation",
      icon: "💻",
    },
  ],
};

export default function Step5({ data, updateData }: Step5Props) {
  const [search, setSearch] = useState("");
  const [customTeam, setCustomTeam] = useState("");

  const toggleTeam = (team: string) => {
    const updated = data.teams.includes(team)
      ? data.teams.filter((t: string) => t !== team)
      : [...data.teams, team];
    updateData({ teams: updated });
  };

  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    const results: Record<string, any[]> = {};
    for (const [category, teams] of Object.entries(TEAM_CATEGORIES)) {
      const matches = teams.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
      );
      if (matches.length) results[category] = matches;
    }
    return results;
  }, [search]);

  // Add custom team
  const addCustomTeam = () => {
    const name = customTeam.trim();
    if (!name) return;
    if (data.teams.includes(name)) return;

    updateData({ teams: [...data.teams, name] });
    setCustomTeam("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Join Teams (Optional)
        </h2>
        <p className="text-gray-600">Select teams you want to be part of</p>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800 text-sm">
          ℹ️ You can join or leave teams anytime from your dashboard.
        </p>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for teams …"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
        focus:ring-indigo-500 text-gray-900"
      />

      {/* Add Custom Team */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Request new team"
          value={customTeam}
          onChange={(e) => setCustomTeam(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <button
          onClick={addCustomTeam}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      {/* Teams Grid */}
      <div className="space-y-10">
        {Object.entries(filteredTeams).map(([category, teams]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teams.map((team) => {
                const selected = data.teams.includes(team.name);

                return (
                  <div
                    key={team.name}
                    onClick={() => toggleTeam(team.name)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                      ${
                        selected
                          ? "border-indigo-600 bg-indigo-50 shadow-sm"
                          : "border-gray-300 hover:border-indigo-400"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{team.icon}</span>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {team.description}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleTeam(team.name)}
                        className="w-5 h-5 mt-1 accent-indigo-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Teams Summary */}
      {data.teams.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800 font-medium mb-2">Selected Teams:</p>

          <div className="flex flex-wrap gap-2">
            {data.teams.map((team: string) => (
              <span
                key={team}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
