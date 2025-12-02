"use client";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Failed</h1>
        <p className="text-gray-700 mb-4">
          Something went wrong while verifying your login link.
        </p>

        <a
          href="/auth"
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
