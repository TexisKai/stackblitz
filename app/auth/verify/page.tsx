"use client";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verify Your Email
        </h1>

        <p className="text-gray-600 mb-6">
          A verification link has been sent to your DU email.  
          Click the link to finish signing in.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 p-4 rounded-lg mb-6 text-sm">
          📌 *Tip:* Check your **Spam** or **Promotions** folder if you don't see the mail.
        </div>

        <p className="text-sm text-gray-500">
          You can close this page after verifying.
        </p>
      </div>
    </div>
  );
}
