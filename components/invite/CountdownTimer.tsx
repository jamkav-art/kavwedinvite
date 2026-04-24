"use client";

import FlipCountdown from "./FlipCountdown";

type CountdownTimerProps = {
  weddingDate: string;
  accentColor?: string;
  className?: string;
};

export default function CountdownTimer({
  weddingDate,
  accentColor,
  className,
}: CountdownTimerProps) {
  return (
    <FlipCountdown
      targetDate={weddingDate}
      accentColor={accentColor}
      className={className}
    />
  );
}
