'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mapProfileUpdate } from '@/lib/mapper';
import type { OnboardingData } from '@/types';

export function useOnboarding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeOnboarding = async (userId: string, data: OnboardingData) => {
    setLoading(true);
    setError(null);

    try {
      // STEP 1 — Get student row
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_id', userId)            // FIXED (correct column)
        .single();

      if (fetchError) throw fetchError;

      // STEP 2 — Update student base info
      const { error: updateError } = await supabase
        .from('students')
        .update({
          college: data.college,
          course: data.course,
          year: data.year,
          onboarding_complete: true,
        })
        .eq('auth_id', userId);          // FIXED

      if (updateError) throw updateError;

      // STEP 3 — Upsert profile
      const profileData = {
        student_id: student.id,
        interests: data.interests,
        skills: data.skills,
        teams: data.teams,
        du_id_url: data.duIdUrl,
        verification_status: 'pending',
      };

      const { error: profileError } = await supabase
        .from('student_profiles')
        .upsert(profileData, { onConflict: 'student_id' });

      if (profileError) throw profileError;

      // STEP 4 — Insert student-community join rows
      if (data.teams.length > 0) {
        const { data: communities, error: commError } = await supabase
          .from('communities')
          .select('id, name')
          .in('name', data.teams);

        if (commError) throw commError;

        const insertRows = communities?.map((c) => ({
          student_id: student.id,
          community_id: c.id,
        })) || [];

        if (insertRows.length > 0) {
          const { error: insertError } = await supabase
            .from('student_communities')
            .insert(insertRows);

          if (insertError) throw insertError;
        }
      }

      setLoading(false);
      return { success: true };

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onboarding failed';
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  return { completeOnboarding, loading, error };
}
