// All DU student email domains (shortened – add your full list later)
export const DU_STUDENT_DOMAINS = [
  "du.ac.in",
  "aurobindo.du.ac.in",
  "st-stephens.du.ac.in",
  "hansraj.du.ac.in",
  "miranda.du.ac.in",
  "lsr.du.ac.in",
  "ramjas.du.ac.in",
  "kirorimal.du.ac.in",
  "dsc.du.ac.in",
  "dcac.du.ac.in",
  "gargi.du.ac.in",
  "svc.du.ac.in",
  "sgtb.du.ac.in",
  "kalindi.du.ac.in",
  "indra.du.ac.in",
  "jesusandmary.du.ac.in",
];

// ------------------------------------------------------------
// 1️⃣ STRICT STUDENT-ONLY CHECK (rollno_year @ college.du.ac.in)
// ------------------------------------------------------------
export function isDUStudentEmail(email: string): boolean {
  const lower = email.toLowerCase();
  const [local, domain] = lower.split("@");

  if (!domain || !DU_STUDENT_DOMAINS.includes(domain)) return false;

  // student pattern: 1033_22 / 3012_23 / 1101_24...
  const rollPattern = /^[0-9]{4}[_-][0-9]{2}$/;

  return rollPattern.test(local) || detectStudentEmailPattern(lower);
}

// ------------------------------------------------------------
// 2️⃣ FLEXIBLE PATTERN: allows xyz.1033_22 or abc-1012_23, etc
// ------------------------------------------------------------
export function detectStudentEmailPattern(email: string): boolean {
  const local = email.split("@")[0];

  // extract things like 1033_22 or 1019-23
  const pattern = /([0-9]{4})[_-]([0-9]{2})/;

  return pattern.test(local);
}
