import React from "react";

export default function QuizLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]">
      {/* Animated Heart */}
      <div className="text-6xl mb-8 animate-pulse">💓</div>

      {/* Loading Skeleton */}
      <div className="w-72 space-y-4">
        {/* Category badge skeleton */}
        <div className="mx-auto w-24 h-6 rounded-full bg-gray-100 animate-pulse" />

        {/* Question text skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto animate-pulse" />
        </div>

        {/* Option skeletons */}
        <div className="space-y-3 pt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gray-50 animate-pulse border border-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
