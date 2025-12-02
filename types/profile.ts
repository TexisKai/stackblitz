export interface UserProfile {
  id: string; // same as auth.users
  full_name: string;
  roll_number: string;
  college: string;
  course: string;
  year_of_admission: number;
  onboarding_completed: boolean;
  id_verified: boolean;
  created_at: string;
}
