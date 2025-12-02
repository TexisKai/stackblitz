"use client";

import { useMemo, useState } from "react";

interface Step1Props {
  data: any;
  updateData: (updates: any) => void;
}

/* ---------------------------------------------
   📌 Complete DU College List (North/South/Off-Campus)
---------------------------------------------- */
const DU_COLLEGES = [
  // North Campus
  "Hindu College",
  "Hansraj College",
  "Kirori Mal College",
  "Ramjas College",
  "Miranda House",
  "SRCC",
  "St. Stephen's College",
  "SGTB Khalsa College",
  "Daulat Ram College",
  "Indraprastha College for Women",

  // South Campus
  "Sri Venkateswara College",
  "Gargi College",
  "Maitreyi College",
  "Mata Sundri College",
  "Sri Aurobindo College",
  "Kamala Nehru College",
  "Deshbandhu College",
  "Dyal Singh College",

  // Off-Campus
  "Aryabhatta College",
  "Shaheed Bhagat Singh College",
  "Zakir Husain Delhi College",
  "Shyam Lal College",
  "Acharya Narendra Dev College",
  "Delhi College of Arts & Commerce",
  "Kalindi College",
  "Lakshmibai College",

  "Other"
];

/* ---------------------------------------------
   📌 DU Courses (UG + PG, short form)
   Department → Course Name
---------------------------------------------- */
const DU_COURSES = [
  // Commerce
  "BCom (Hons)",
  "BCom Programme",
  "MCom",

  // Arts & Humanities
  "BA English (Hons)",
  "BA Political Science (Hons)",
  "BA History (Hons)",
  "BA Psychology (Hons)",
  "MA Political Science",
  "MA English",
  "MA History",

  // Science
  "BSc Computer Science",
  "BSc Physics",
  "BSc Chemistry",
  "MSc Physics",
  "MSc Chemistry",
  "MSc Zoology",

  // Management / Vocational
  "BMS",
  "BBA(FIA)",

  // Tech / Engineering (DU-affiliated)
  "BTech CS",
  "BTech IT",

  // Generic
  "Other"
];

/* ---------------------------------------------
   📌 Year of Study (Auto-detect ready)
---------------------------------------------- */
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function Step1({ data, updateData }: Step1Props) {
  const [courseQuery, setCourseQuery] = useState("");

  /* ---------------------------------------------
     🔍 Autocomplete Course Search
  ---------------------------------------------- */
  const filteredCourses = useMemo(() => {
    if (!courseQuery.trim()) return DU_COURSES;
    return DU_COURSES.filter((c) =>
      c.toLowerCase().includes(courseQuery.toLowerCase())
    );
  }, [courseQuery]);

  return (
    <div className="space-y-6">
      {/* HEADING */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
          placeholder="e.g. Riya Sharma"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        />
      </div>

      {/* COLLEGE SELECTION */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          College Name <span className="text-red-500">*</span>
        </label>
        <select
          value={data.college}
          onChange={(e) => updateData({ college: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        >
          <option value="">Select College</option>
          {DU_COLLEGES.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>

      {/* COURSE AUTOCOMPLETE */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          value={courseQuery || data.course}
          onChange={(e) => {
            setCourseQuery(e.target.value);
            updateData({ course: e.target.value });
          }}
          placeholder="Search course…"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
          required
        />

        {courseQuery && (
          <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto z-20 border">
            {filteredCourses.map((course) => (
              <button
                key={course}
                onClick={() => {
                  updateData({ course });
                  setCourseQuery("");
                }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-gray-700"
              >
                {course}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* YEAR SELECTION */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Year of Study <span className="text-red-500">*</span>
        </label>
        <select
          value={data.year}
          onChange={(e) => updateData({ year: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-indigo-500 text-gray-900"
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

      {/* INFO BOX */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">ℹ️ You can edit this anytime later.</p>
      </div>
    </div>
  );
}
