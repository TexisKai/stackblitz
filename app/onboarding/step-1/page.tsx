'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step1() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '' })

  function handleNext() {
    if (!form.name || !form.email) {
      alert('Please fill all fields')
      return
    }
    sessionStorage.setItem('onboarding_step1', JSON.stringify(form))
    router.push('/onboarding/step-2')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Step 1: Personal Information</h2>
          <p className="text-gray-600">Tell us about yourself</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md"
              value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-md"
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
        </div>
        <button onClick={handleNext} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Next
        </button>
        <div className="text-center text-sm text-gray-600">Step 1 of 5</div>
      </div>
    </div>
  )
}
