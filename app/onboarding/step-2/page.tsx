'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Step2() {
  const router = useRouter()
  const [form, setForm] = useState({ college: '', studentId: '' })

  function handleNext() {
    if (!form.college || !form.studentId) {
      alert('Please fill all fields')
      return
    }
    sessionStorage.setItem('onboarding_step2', JSON.stringify(form))
    router.push('/onboarding/step-3')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Step 2: College Details</h2>
          <p className="text-gray-600">Your college information</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">College Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md"
              placeholder="Delhi University College"
              value={form.college} onChange={(e) => setForm({...form, college: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <input type="text" className="w-full px-3 py-2 border rounded-md"
              placeholder="Your Student ID"
              value={form.studentId} onChange={(e) => setForm({...form, studentId: e.target.value})} />
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="w-full py-2 border rounded-md">Back</button>
          <button onClick={handleNext} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Next</button>
        </div>
        <div className="text-center text-sm text-gray-600">Step 2 of 5</div>
      </div>
    </div>
  )
}
