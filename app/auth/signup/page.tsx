'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseBrowser'
import { isValidDUEmail, validatePassword } from '@/lib/auth/validators'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!isValidDUEmail(form.email)) throw new Error('Use DU email (e.g., student@du.ac.in)')
      const passwordCheck = validatePassword(form.password)
      if (!passwordCheck.valid) throw new Error(passwordCheck.message)
      if (form.password !== form.confirmPassword) throw new Error('Passwords do not match')
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { display_name: form.name } }
      })
      if (signUpError) throw signUpError
      if (!data.user) throw new Error('Failed to create account')
      const res = await fetch('/api/auth/create-profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.user.id, display_name: form.name, du_email: form.email })
      })
      if (!res.ok) throw new Error('Failed to create profile')
      router.push('/onboarding/step-1')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div><h2 className="text-center text-3xl font-extrabold">Create your MyCollege account</h2>
        <p className="text-center text-sm text-gray-600">Join the DU student community</p></div>
        <form className="space-y-6" onSubmit={handleSignup}>
          {error && <div className="bg-red-50 p-4 rounded"><p className="text-sm text-red-800">{error}</p></div>}
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" required className="w-full px-3 py-2 border rounded-md" placeholder="Full Name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">DU Email</label>
              <input type="email" required className="w-full px-3 py-2 border rounded-md" placeholder="student@du.ac.in"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" required className="w-full px-3 py-2 border rounded-md" placeholder="Password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div><label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" required className="w-full px-3 py-2 border rounded-md" placeholder="Confirm Password"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></div>
          </div>
          <div className="flex items-center">
            <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
            <label htmlFor="remember" className="ml-2 text-sm">Keep me logged in</label>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
          <div className="text-center"><a href="/auth/login" className="text-indigo-600">Already have an account? Log in</a></div>
        </form>
      </div>
    </div>
  )
}
