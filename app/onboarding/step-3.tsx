"use client";

import { useState, useEffect } from "react";

interface Step3Props {
  data: any;
  updateData: (updates: any) => void;
}

const INTEREST_CATEGORIES = {
  "🔥 Popular on Campus": [
    "Tech",
    "Business",
    "Photography",
    "Music",
    "Sports",
    "Startups",
  ],
  "🎭 Arts & Culture": [
    "Drama",
    "Fashion",
    "Writing",
    "Art & Design",
    "Dance",
  ],
  "💼 Academics & Careers": ["Research", "Finance", "Entrepreneurship"],
  "🧘 Lifestyle & Personal Growth": ["Fitness", "Volunteering", "Travel", "Cooking"],
  "🎮 Fun & Recreation": ["Gaming", "Movies", "Comedy"],
};

export default function Step3({ data, updateData }: Step3Props) {
  const [touched, setTouched] = useState(false);

  const toggleInterest = (interest: string) => {
    setTouched(true);

    // Prevent removing below minimum
    if (
      data.interests.includes(interest) &&
      data.interests.length <= 2
    ) {
      return;
    }

    const updated = data.interests.includes(interest)
      ? data.interests.filter((i: string) => i !== interest)
      : [...data.interests, interest];

    updateData({ interests: updated });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Interests
        </h2>
        <p className="text-gray-600">
          Choose at least 2 — used to personalize your MyCollege experience
        </p>
      </div>

      {/* TIP CARD */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-indigo-800 text-sm">
          🎯 Selecting more helps us recommend the best clubs, events, and opportunities.
        </p>
      </div>

      {/* FULL INTEREST CATEGORY GROUPING */}
      <div className="space-y-8">
        {Object.entries(INTEREST_CATEGORIES).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((interest) => {
                const selected = data.interests.includes(interest);

                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        selected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-gray-300 hover:border-indigo-400"
                      }
                    `}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* COUNT INDICATOR */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
        <span className="text-gray-700 font-medium">Interests Selected</span>
        <span className="text-indigo-600 font-bold text-lg">
          {data.interests.length}
        </span>
      </div>

      {/* WARNING MESSAGE */}
      {touched && data.interests.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please select at least 2 interests to continue.
          </p>
        </div>
      )}
    </div>
  );
}
