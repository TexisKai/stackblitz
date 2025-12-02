import { supabase } from './supabase';

const DU_EMAIL_DOMAINS = [
  'du.ac.in', 'delhiuniversity.ac.in', 'delhi-university.ac.in',
  'st-stephens.du.ac.in', 'stephens.du.ac.in', 'hindu.du.ac.in',
  'ramjas.du.ac.in', 'hansraj.du.ac.in', 'kirorimal.du.ac.in',
  'kmc.du.ac.in', 'srcc.du.ac.in', 'sgtb.du.ac.in', 'svc.du.ac.in',
  'dcc.du.ac.in', 'venky.du.ac.in', 'aurobindo.du.ac.in',
  'dsc.du.ac.in', 'maitreyi.du.ac.in', 'dcac.du.ac.in',
  'gargi.du.ac.in', 'sgs.du.ac.in', 'rlc.du.ac.in',
  'miranda.du.ac.in', 'lsr.du.ac.in', 'jesusandmary.du.ac.in',
  'kamla.du.ac.in', 'indra.du.ac.in', 'matasundri.du.ac.in',
  'zakir.du.ac.in', 'motilal.du.ac.in', 'shyamlal.du.ac.in',
  'aryabhatta.du.ac.in', 'shyama.du.ac.in', 'dronacharya.du.ac.in',
  'swami.du.ac.in', 'vivekananda.du.ac.in', 'kalindi.du.ac.in',
  'nsit.ac.in', 'nsut.ac.in', 'igdtuw.ac.in', 'aud.ac.in',
  'edu.du.ac.in', 'college.du.ac.in', 'mail.du.ac.in',
];

export function validateDUEmail(email: string): boolean {
  return DU_EMAIL_DOMAINS.some(domain =>
    email.toLowerCase().endsWith(domain)
  );
}

export async function signupWithDUEmail(
  email: string,
  password: string,
  fullName: string
) {
  if (!validateDUEmail(email)) {
    throw new Error('Please use a valid DU email address');
  }

  console.log('➡️ Starting signup:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: undefined,
    },
  });

  if (error) {
    console.error('❌ Signup error:', error);
    throw new Error(error.message);
  }

  // If confirmation is OFF — Supabase automatically logs user in
  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session) {
    console.log('✅ Email confirmation disabled — user auto-logged in');
    return sessionData; // already logged in
  }

  // If confirmation is ON — try auto-login as fallback
  console.log('⚠️ No session detected — trying auto-login');

  const loginTry = await supabase.auth.signInWithPassword({ email, password });

  if (loginTry.data.session) {
    console.log('⚡ Auto-login successful');
    return loginTry.data;
  }

  console.warn('📧 Email confirmation REQUIRED by dashboard setting');
  throw new Error(
    'Your university requires email verification. Please check your inbox and click the confirmation link.'
  );
}

export async function loginWithEmail(email: string, password: string) {
  console.log('➡️ Login:', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('❌ Login error:', error);
    throw new Error(error.message);
  }

  console.log('✅ Login successful');
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
