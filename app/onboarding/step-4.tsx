"use client";

import { useState, useMemo } from "react";

interface Step4Props {
  data: any;
  updateData: (updates: any) => void;
}

const SKILL_CATEGORIES = {
  "💻 Tech & Development": [
    "Programming",
    "Python",
    "SQL",
    "Data Analysis",
    "Excel",
  ],
  "🎨 Creative & Design": [
    "Graphic Design",
    "Video Editing",
    "Photography",
    "Content Writing",
    "Designing",
  ],
  "📈 Business & Growth": [
    "Marketing",
    "Finance",
    "Management",
    "Public Speaking",
    "Event Planning",
  ],
  "📱 Social & Media": ["Social Media", "Brand Strategy", "Influencer Marketing"],
};

export default function Step4({ data, updateData }: Step4Props) {
  const [search, setSearch] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  // Filter skills based on search
  const filteredSkills = useMemo(() => {
    const results: Record<string, string[]> = {};
    for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
      const matches = skills.filter((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      );
      if (matches.length) results[category] = matches;
    }
    return results;
  }, [search]);

  const toggleSkill = (skill: string) => {
    // Prevent removing the last selected skill
    if (data.skills.includes(skill) && data.skills.length <= 1) {
      return;
    }

    const updated = data.skills.includes(skill)
      ? data.skills.filter((s: string) => s !== skill)
      : [...data.skills, skill];

    updateData({ skills: updated });
  };

  const addCustomSkill = () => {
    const skill = customSkill.trim();
    if (!skill) return;

    if (skill.length < 2) return;

    if (data.skills.includes(skill)) {
      setCustomSkill("");
      return;
    }

    updateData({ skills: [...data.skills, skill] });

    setCustomSkill("");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Skills
        </h2>
        <p className="text-gray-600">Choose at least 1 — add custom skills too</p>
      </div>

      {/* TIP */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🎯 Skills help us recommend teams, projects, and campus opportunities.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div>
        <input
          type="text"
          placeholder="Search skills (e.g., Python, Editing)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
          focus:ring-indigo-500 text-gray-900"
        />
      </div>

      {/* CUSTOM SKILL INPUT */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Add a custom skill"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
        />
        <button
          onClick={addCustomSkill}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
        >
          Add
        </button>
      </div>

      {/* RENDER SKILLS */}
      <div className="space-y-10">
        {Object.entries(filteredSkills).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => {
                const selected = data.skills.includes(skill);

                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        selected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-gray-300 hover:border-indigo-400"
                      }
                    `}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* LIST OF SELECTED SKILLS */}
      {data.skills.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="text-gray-800 font-medium mb-2">Your Skills:</p>

          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* VALIDATION MESSAGE */}
      {data.skills.length < 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please select at least 1 skill.
          </p>
        </div>
      )}
    </div>
  );
}
