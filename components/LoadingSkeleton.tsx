import React from "react";

export interface LoadingSkeletonProps {
  lines?: number;
}

export default function LoadingSkeleton({ lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded w-full" />
      ))}
    </div>
  );
}

// Card-style skeleton for widgets
export function CardSkeleton() {
  return (
    <div className="border rounded-xl p-4 shadow-sm animate-pulse space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-5/6" />
      <div className="h-3 bg-gray-300 rounded w-2/3" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
    </div>
  );
}
