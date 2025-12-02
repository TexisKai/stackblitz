'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ProgressBar } from '@/components/ProgressBar';

import Step1 from './step-1';
import Step2 from './step-2';
import Step3 from './step-3';
import Step4 from './step-4';
import Step5 from './step-5';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { completeOnboarding, loading: onboardingLoading } = useOnboarding();

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🔥 FIXED: Added fullName to avoid "uncontrolled input" error
  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    course: '',
    year: '',
    interests: [] as string[],
    skills: [] as string[],
    teams: [] as string[],
    duIdUrl: '',
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Validation rules
  const validateStep = () => {
    switch (step) {
      case 1:
        return !!(
          formData.fullName &&
          formData.college &&
          formData.course &&
          formData.year
        );
      case 2:
        return !!formData.duIdUrl;
      case 3:
        return formData.interests.length >= 2;
      case 4:
        return formData.skills.length >= 1;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const next = () => {
    if (!validateStep()) {
      setError('Please complete this step before proceeding');
      return;
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prev = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setError(null);

      await completeOnboarding(user.id, formData);
      setSuccess(true);

      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (authLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            data={formData}
            updateData={updateFormData}
          />
        );

      case 2:
        return (
          <Step2
            duIdUrl={formData.duIdUrl}
            setDuIdUrl={(url: string) => updateFormData({ duIdUrl: url })}
            onNext={next}
            onBack={prev}
          />
        );

      case 3:
        return (
          <Step3
            data={formData}
            updateData={updateFormData}
          />
        );

      case 4:
        return (
          <Step4
            data={formData}
            updateData={updateFormData}
          />
        );

      case 5:
        return (
          <Step5
            data={formData}
            updateData={updateFormData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600">Join the MyCollege community in just 5 steps</p>
        </div>

        {/* 🔥 FIXED ProgressBar props */}
        <ProgressBar currentStep={step} totalSteps={5} />

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">✓ Profile completed! Redirecting…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          <div className="flex justify-between items-center mt-8 pt-8 border-t">
            <button
              onClick={prev}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600">Step {step} of {5}</div>

            {step === 5 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
              >
                ✓ Complete Onboarding
              </button>
            ) : (
              <button
                onClick={next}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
              >
                Next →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
