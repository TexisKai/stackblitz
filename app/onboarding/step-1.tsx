'use client';

interface Step1Props {
  data: any;
  updateData: (updates: any) => void;
}

const COLLEGES = [
  'Delhi University',
  "St. Stephen's College",
  'Miranda House',
  'Ramakrishna College of Commerce',
  'Shyam Lal College',
  'Delhi College of Arts and Commerce',
  'Hansraj College',
  'Kalindi College',
  'Acharya Narendra Dev College',
  'Aryabhata College',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function Step1({ data, updateData }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        />
      </div>

      {/* College Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          College Name <span className="text-red-500">*</span>
        </label>
        <select
          value={data.college}
          onChange={(e) => updateData({ college: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        >
          <option value="">Select College</option>
          {COLLEGES.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>

      {/* Course Input (Text Input Instead of Dropdown) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Course <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.course}
          onChange={(e) => updateData({ course: e.target.value })}
          placeholder="e.g. BCom (Hons)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        />
      </div>

      {/* Year Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Year of Study <span className="text-red-500">*</span>
        </label>
        <select
          value={data.year}
          onChange={(e) => updateData({ year: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        >
          <option value="">Select Year</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          ℹ️ You can always edit this information later
        </p>
      </div>
    </div>
  );
}
