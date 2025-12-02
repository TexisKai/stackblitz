// -----------------------------
// STUDENT MAPPER
// -----------------------------
export function mapStudent(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    authId: row.auth_id,                     // FIXED (was row.authid)
    email: row.email,
    fullName: row.fullname,
    college: row.college,
    course: row.course,
    year: row.year,
    onboardingComplete: row.onboarding_complete,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  };
}

// -----------------------------
// STUDENT PROFILE MAPPER
// -----------------------------
export function mapStudentProfile(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    studentId: row.student_id,               // FIXED name (was studentid)
    duIdUrl: row.du_id_url,                  // FIXED name (was duidurl)
    interests: row.interests || [],
    skills: row.skills || [],
    teams: row.teams || [],
    verificationStatus: row.verification_status,
    createdAt: row.createdat,
    updatedAt: row.updatedat,
  };
}

// -----------------------------
// PROFILE UPDATE MAPPER
// -----------------------------
export function mapProfileUpdate(form: any) {
  return {
    du_id_url: form.duIdUrl,
    interests: form.interests,
    skills: form.skills,
    teams: form.teams,
  };
}
