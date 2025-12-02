"use client";

import { MaskContainer } from "@/components/MaskContainer";

export default function AccessDeniedPage() {
  return (
    <MaskContainer
      revealText={
        <div className="text-5xl font-bold text-red-600 leading-tight">
          FIRST RULE OF MY COLLEGE APP IS<br />
          YOU DO NOT TALK ABOUT MY COLLEGE APP.<br /><br />
          SECOND RULE OF MY COLLEGE APP IS<br />
          YOU DO NOT TALK ABOUT MY COLLEGE APP.
        </div>
      }
    >
      <div className="text-4xl font-bold text-white drop-shadow-xl leading-tight">
        This space is only for verified DU students.
        <br />
        Access has been denied.
      </div>
    </MaskContainer>
  );
}
