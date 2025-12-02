"use client";

import { MaskContainer } from "@/components/MaskContainer";

export default function RestrictedPage() {
  return (
    <MaskContainer
      className="relative bg-black"
      revealText={
        <div className="flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
            ACCESS DENIED
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-xl mt-6 leading-relaxed">
            This area is restricted exclusively for verified
            <span className="font-semibold text-indigo-400"> DU students </span>.
          </p>

          <p className="text-gray-400 text-sm mt-4">
            Verification failed — identity mismatch detected.
          </p>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center text-white space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase">
          First rule of MyCollege App:
        </h2>

        <p className="text-2xl md:text-3xl font-semibold opacity-90">
          You do NOT talk about MyCollege App.
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase mt-8">
          Second rule of MyCollege App:
        </h2>

        <p className="text-2xl md:text-3xl font-semibold opacity-90">
          You do NOT talk about MyCollege App.
        </p>

        <div className="mt-10 text-gray-400 text-sm max-w-lg">
          Your DU student verification could not be confirmed.  
          If you think this is a mistake, contact support with your DU ID proof.
        </div>
      </div>
    </MaskContainer>
  );
}
