"use client";

import React from "react";

interface GradientAnimatedBorderProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  children: React.ReactNode;
  className?: string;
}

export default function GradientAnimatedBorder({
  colors,
  children,
  className = "",
}: GradientAnimatedBorderProps) {
  return (
    <div
      className={`relative rounded-2xl p-[3px] overflow-hidden ${className}`}
    >
      {/* Animated conic gradient layer */}
      <div
        className="absolute inset-0 rounded-2xl animate-wiz-border-rotate"
        style={{
          background: `conic-gradient(
            ${colors.primary},
            ${colors.secondary},
            ${colors.accent},
            ${colors.primary}
          )`,
        }}
      />
      {/* Inner content — masks out the center so only border shows */}
      <div className="relative rounded-2xl bg-[var(--wiz-bg-start)] h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
