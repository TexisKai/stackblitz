export interface Student {
  id: string;
  authId: string;
  email: string;
  fullName: string;
  college: string;
  course: string;
  year: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  duIdUrl: string | null;
  interests: string[];
  skills: string[];
  teams: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  college: string;
  course: string;
  year: string;
  interests: string[];
  skills: string[];
  teams: string[];
  duIdUrl: string;
}
