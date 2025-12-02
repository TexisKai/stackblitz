'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapStudent, mapStudentProfile } from '@/lib/mapper';

export default function DashboardPage() {
  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          console.error('No authenticated user');
          return;
        }

        // Fetch student basic info
        const { data: studentRow } = await supabase
          .from('students')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        const mappedStudent = mapStudent(studentRow);

        // If student is missing
        if (!mappedStudent) {
          setLoading(false);
          return;
        }

        // Fetch student profile
        const { data: profileRow } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('student_id', mappedStudent.id)
          .single();

        const mappedProfile = mapStudentProfile(profileRow);

        setStudent(mappedStudent);
        setProfile(mappedProfile);
        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading dashboard…
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Could not load student details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">
        Welcome, {student.fullName || 'Student'} 👋
      </h1>
      <p className="text-gray-400 mb-10">Your DU student dashboard</p>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* STUDENT INFO */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>

          <div className="space-y-2 text-gray-300">
            <p><span className="font-semibold text-white">Email:</span> {student.email}</p>
            <p><span className="font-semibold text-white">College:</span> {student.college}</p>
            <p><span className="font-semibold text-white">Course:</span> {student.course}</p>
            <p><span className="font-semibold text-white">Year:</span> {student.year}</p>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>

          {!profile ? (
            <p className="text-gray-400">No profile details found.</p>
          ) : (
            <div className="space-y-6">
              {/* Interests */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Interests</h3>
                {profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.interests.map((i: string) => (
                      <span
                        key={i}
                        className="bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No interests added</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Skills</h3>
                {profile.skills && Array.isArray(profile.skills) && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((s: string) => (
                      <span
                        key={s}
                        className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No skills added</p>
                )}
              </div>

              {/* Teams */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Teams Joined</h3>
                {profile.teams && Array.isArray(profile.teams) && profile.teams.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profile.teams.map((t: string) => (
                      <span
                        key={t}
                        className="bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No teams joined</p>
                )}
              </div>

              {/* Verification */}
              <div>
                <h3 className="text-lg font-semibold mb-1">Verification Status</h3>
                <p className="text-blue-300">
                  {profile.verificationStatus || 'pending'}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
