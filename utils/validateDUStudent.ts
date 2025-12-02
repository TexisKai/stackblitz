export function isValidDUStudent(email: string) {
  const e = email.toLowerCase();
  const parts = e.split("@");
  if (parts.length !== 2) return false;

  const local = parts[0];
  const domain = parts[1];

  const allowedColleges = [
    "aurobindo.du.ac.in","hansraj.du.ac.in","ramjas.du.ac.in",
    "miranda.du.ac.in","lsr.du.ac.in","dcc.du.ac.in",
    "dcac.du.ac.in","gargi.du.ac.in","hindu.du.ac.in"
  ];

  if (!allowedColleges.includes(domain)) return false;

  const rollPattern = /^[0-9]{4,5}[_-]?[0-9]{2}$/;
  return rollPattern.test(local);
}
