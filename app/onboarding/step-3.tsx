'use client';

interface Step3Props {
  data: any;
  updateData: (updates: any) => void;
}

const INTERESTS = [
  'Tech',
  'Music',
  'Dance',
  'Drama',
  'Fashion',
  'Business',
  'Startups',
  'Fitness',
  'Volunteering',
  'Sports',
  'Art & Design',
  'Photography',
  'Writing',
  'Gaming',
  'Cooking',
  'Travel',
];

export default function Step3({ data, updateData }: Step3Props) {
  const toggleInterest = (interest: string) => {
    const updated = data.interests.includes(interest)
      ? data.interests.filter((i: string) => i !== interest)
      : [...data.interests, interest];
    updateData({ interests: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Interests
        </h2>
        <p className="text-gray-600">Choose at least 2 interests</p>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-purple-800 text-sm">
          💡 These help us recommend groups and opportunities for you
        </p>
      </div>

      {/* Interests Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {INTERESTS.map((interest) => (
          <label
            key={interest}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              data.interests.includes(interest)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input
              type="checkbox"
              checked={data.interests.includes(interest)}
              onChange={() => toggleInterest(interest)}
              className="w-4 h-4 rounded"
            />
            <span className="ml-3 text-gray-700 font-medium">{interest}</span>
          </label>
        ))}
      </div>

      {/* Counter */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-700 font-medium">Interests Selected</span>
        <span className="text-indigo-600 font-bold text-lg">
          {data.interests.length} / {INTERESTS.length}
        </span>
      </div>

      {/* Validation Message */}
      {data.interests.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please select at least 2 interests to continue
          </p>
        </div>
      )}
    </div>
  );
}