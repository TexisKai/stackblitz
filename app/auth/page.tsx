'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signupWithDUEmail, loginWithEmail, validateDUEmail } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    const savePasswordEnabled = localStorage.getItem('save_password_enabled');

    if (savedEmail) setEmail(savedEmail);
    if (savePasswordEnabled === 'true') setSavePassword(true);
  }, []);

  // ----------------------------------------------------
  // HANDLE SUBMIT — FIXED FOR SUPABASE RESPONSE TYPES
  // ----------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // ✔ LOGIN — Correct Supabase v2 response
        const { user, session } = await loginWithEmail(email, password);
        console.log('Login OK:', user?.email);
      } else {
        // ✔ SIGNUP — Correct Supabase v2 response
        if (!validateDUEmail(email)) {
          throw new Error('Please use your DU college email.');
        }

        const { user, session } = await signupWithDUEmail(
          email,
          password,
          fullName
        );

        console.log('Signup OK:', user?.email);

        // If signup returns no session → login manually
        if (!session) {
          await loginWithEmail(email, password);
        }
      }

      // Save credentials
      if (savePassword) {
        localStorage.setItem('saved_email', email);
        localStorage.setItem('save_password_enabled', 'true');
      }

      router.push('/onboarding');
      router.refresh();

    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MyCollege</h1>
          <p className="text-gray-600">Delhi University Student Platform</p>
        </div>

        {/* Error box */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-indigo-500 text-gray-900"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DU Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@st-stephens.du.ac.in"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-indigo-500 text-gray-900"
              required
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-indigo-500 text-gray-900 pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Save credentials */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={savePassword}
              onChange={(e) => setSavePassword(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded 
              focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Save my credentials
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg 
            font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? 'Processing…' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Switch login / signup */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold ml-2 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>

      </div>
    </div>
  );
}
