import { supabase } from "./supabaseClient";
import { isDUStudentEmail } from "./validators";

// ------------------------------------------------------------
// SIGNUP USING MAGIC LINK (signInWithOtp)
// ------------------------------------------------------------
export async function signupWithDUEmail(email: string, fullName: string) {
  if (!isDUStudentEmail(email)) {
    throw new Error("Only DU student roll-number emails are allowed.");
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { full_name: fullName },
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

// ------------------------------------------------------------
// LOGIN USING MAGIC LINK
// ------------------------------------------------------------
export async function loginMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
}
