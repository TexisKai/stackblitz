"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/supabaseBrowser";

import { ProgressBar } from "@/components/ProgressBar";

import Step1 from "./step-1";
import Step2 from "./step-2";
import Step3 from "./step-3";
import Step4 from "./step-4";
import Step5 from "./step-5";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  // Step control
  const stepFromUrl = Number(searchParams.get("step")) || 1;
  const [step, setStep] = useState(stepFromUrl);

  // Global error + success
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Profile Data
  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    course: "",
    year: "",
    interests: [] as string[],
    skills: [] as string[],
    teams: [] as string[],
    duIdUrl: "",
  });

  // Lock step inside valid bounds
  useEffect(() => {
    if (step < 1) updateStep(1);
    if (step > 5) updateStep(5);
  }, [step]);

  // Sync step with URL
  const updateStep = (s: number) => {
    setStep(s);
    router.replace(`/onboarding?step=${s}`);
  };

  // Load autosaved form
  useEffect(() => {
    const saved = localStorage.getItem("onboarding_form");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem("onboarding_form", JSON.stringify(formData));
  }, [formData]);

  // Validation
  const validateStep = () => {
    switch (step) {
      case 1:
        return (
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

  // Move forward safely
  const nextStep = () => {
    if (!validateStep()) {
      setError("Please complete this step before continuing.");
      return;
    }
    setError(null);
    updateStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    updateStep(step - 1);
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    try {
      setSaving(true);
      setError(null);

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not logged in.");

      const { error: updateError } = await supabase
        .from("students")
        .update({
          full_name: formData.fullName,
          college: formData.college,
          course: formData.course,
          year: formData.year,
          du_id_url: formData.duIdUrl,
          interests: formData.interests,
          skills: formData.skills,
          teams: formData.teams,
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq("auth_id", currentUser.id);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to complete onboarding. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!user) return;

    const ok = await completeOnboarding();
    if (!ok) return;

    setSuccess(true);
    localStorage.removeItem("onboarding_form");

    setTimeout(() => router.push("/dashboard"), 1000);
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return (
          <Step2
            duIdUrl={formData.duIdUrl}
            setDuIdUrl={(duIdUrl: string) =>
              setFormData({ ...formData, duIdUrl })
            }
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return <Step3 data={formData} updateData={setFormData} />;
      case 4:
        return <Step4 data={formData} updateData={setFormData} />;
      case 5:
        return <Step5 data={formData} updateData={setFormData} />;
      default:
        return null;
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // No user → redirect
  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600">Takes less than 2 minutes</p>
        </div>

        <ProgressBar currentStep={step} totalSteps={5} />

        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">✓ Profile completed — Redirecting…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}

          <div className="flex justify-between items-center mt-10 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50"
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-600">Step {step} of 5</div>

            {step === 5 ? (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
              >
                {saving ? "Saving…" : "✓ Finish"}
              </button>
            ) : (
              <button
                onClick={nextStep}
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
