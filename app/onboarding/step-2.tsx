'use client';

import { useState } from 'react';
import { uploadIDDocument } from '@/lib/storage';

interface Step2Props {
  duIdUrl: string;
  setDuIdUrl: (url: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({ duIdUrl, setDuIdUrl, onNext, onBack }: Step2Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const valid = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!valid.includes(selectedFile.type)) {
      setError('Only PDF, JPG, JPEG, PNG allowed');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Select a file before uploading');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const url = await uploadIDDocument(file);   // UPLOAD
      setDuIdUrl(url);                            // ⬅⬅⬅ CRITICAL LINE
      setUploadSuccess(true);

    } catch (err: any) {
      setError(err.message);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (!duIdUrl) {
      setError('Upload your ID before continuing');
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <h2 className="text-2xl font-bold">Identity Verification</h2>
      <p>Upload your DU or College ID</p>

      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <label className="cursor-pointer text-indigo-600">
          Click to upload
          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </label>
        <p className="text-gray-500 text-sm">PDF, JPG, PNG • Max 5MB</p>
      </div>

      {file && (
        <div className="bg-blue-50 p-3 border border-blue-200 rounded">
          Selected: {file.name}
        </div>
      )}

      {file && !uploadSuccess && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}

      {uploadSuccess && (
        <div className="bg-green-50 p-3 border border-green-200 rounded text-green-700">
          ✓ Upload successful!
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button onClick={onBack} className="flex-1 bg-gray-200 py-3 rounded-lg">
          ← Previous
        </button>

        <button
          onClick={handleNext}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg"
          disabled={!duIdUrl}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
