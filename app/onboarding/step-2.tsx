"use client";

import { useState } from "react";
import { uploadIDDocument } from "@/# Phase 2: Create Authentication Pages - Signup mkdir -p app/auth/signup app/auth/login app/api/auth/create-profile/storage";

interface Step2Props {
  duIdUrl: string;
  setDuIdUrl: (url: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({
  duIdUrl,
  setDuIdUrl,
  onNext,
  onBack
}: Step2Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------------------------
      ⭐ SMART FILE VALIDATION
      - DU ID only (PDF/JPG/PNG)
      - Max size 5MB
      - Preview available
  ------------------------------------------------------------ */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(selected.type)) {
      setError("Only PNG, JPG, JPEG, or PDF files are allowed.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5MB.");
      return;
    }

    setFile(selected);
    setError(null);

    // Preview image (except PDF)
    if (selected.type !== "application/pdf") {
      const tempUrl = URL.createObjectURL(selected);
      setPreviewUrl(tempUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  /* -----------------------------------------------------------
      ⭐ UPLOAD + SERVER STORAGE
      - Uses /storage bucket "id-cards"
      - Returns public URL
  ------------------------------------------------------------ */
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const url = await uploadIDDocument(file); // Upload to Supabase
      setDuIdUrl(url);
      setUploadSuccess(true);
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  /* -----------------------------------------------------------
      ⭐ FINAL VALIDATION BEFORE NEXT STEP
      - Ensures uploaded ID exists
      - Prevents skipping
  ------------------------------------------------------------ */
  const handleNext = () => {
    if (!duIdUrl) {
      setError("Upload your ID before continuing.");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
        <p className="text-gray-600">Upload your official DU student ID</p>
      </div>

      {/* ERROR BOX */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* FILE UPLOAD BOX */}
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <label className="cursor-pointer text-indigo-600 font-medium">
          Click to upload your DU ID
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </label>

        <p className="text-gray-500 text-sm mt-2">Supports: PDF, JPG, PNG • Max 5MB</p>
      </div>

      {/* IMAGE PREVIEW */}
      {previewUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="ID preview"
            className="rounded-lg shadow border max-h-56 object-contain mx-auto"
          />
        </div>
      )}

      {/* FILE NAME TEXT */}
      {file && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded text-blue-700">
          Selected file: {file.name}
        </div>
      )}

      {/* UPLOAD BUTTON */}
      {file && !uploadSuccess && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload to Verify"}
        </button>
      )}

      {/* SUCCESS MESSAGE */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 p-3 rounded text-green-700">
          ✓ ID uploaded successfully!
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 py-3 rounded-lg font-medium"
        >
          ← Previous
        </button>

        <button
          onClick={handleNext}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          disabled={!duIdUrl}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
