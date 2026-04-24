"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FlipCountdownProps = {
  targetDate: string;
  accentColor?: string;
  className?: string;
};

// ---------------------------------------------------------------------------
// Distinct gradient palettes per time unit
// ---------------------------------------------------------------------------

type UnitKey = "days" | "hours" | "minutes" | "seconds";

const GRADIENT_CLASS: Record<UnitKey, string> = {
  days: "flip-grad-days",
  hours: "flip-grad-hours",
  minutes: "flip-grad-mins",
  seconds: "flip-grad-secs",
};

const UNIT_LABELS: Record<UnitKey, string> = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Build a natural-language aria-label describing the remaining time.
 * E.g., "7 days, 14 hours, 32 minutes, and 58 seconds remaining"
 */
function buildAriaLabel(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
): string {
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes > 0)
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);

  if (parts.length === 0) return "The event has started!";
  if (parts.length === 1) return `${parts[0]} remaining`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]} remaining`;
}

// ---------------------------------------------------------------------------
// FlipUnit — a single 3D flip card with unique gradient
// ---------------------------------------------------------------------------

function FlipUnit({
  value,
  label,
  accentColor,
  unitKey,
}: {
  value: number;
  label: string;
  accentColor?: string;
  unitKey: UnitKey;
}) {
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const timer = setTimeout(() => {
        setFlipping(false);
        prevRef.current = value;
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const display = pad(value);
  const prevDisplay = pad(prevRef.current);

  const gradClass = GRADIENT_CLASS[unitKey];

  return (
    <div className="flip-unit">
      <div
        className="flip-card-wrap"
        style={
          {
            "--flip-accent": accentColor ?? "currentColor",
          } as React.CSSProperties
        }
      >
        {/* Animated gradient background layer */}
        <div className={`flip-grad-bg ${gradClass}`} />

        {/* Number display — shows CURRENT value, centred in card */}
        <div className="card-half">
          <span
            className="flip-number"
            style={{ color: accentColor ?? undefined }}
          >
            {display}
          </span>
        </div>

        {/* Flipping flap — shows PREVIOUS value then folds away */}
        <div className={`flap ${flipping ? "flipping" : ""}`}>
          <div className={`flap-inner ${gradClass}`}>
            <span
              className="flip-number"
              style={{ color: accentColor ?? undefined }}
            >
              {prevDisplay}
            </span>
          </div>
        </div>
      </div>

      <p className="flip-label">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlipCountdown — orchestrates 4 flip units + colon separators
// ---------------------------------------------------------------------------

export default function FlipCountdown({
  targetDate,
  accentColor,
  className,
}: FlipCountdownProps) {
  const { parts, isValid } = useCountdown(targetDate);

  const isExpired = isValid && parts.totalMs <= 0;

  const ariaLabel = useMemo(
    () =>
      isExpired
        ? "The wedding countdown has ended — the event has started!"
        : buildAriaLabel(parts.days, parts.hours, parts.minutes, parts.seconds),
    [isExpired, parts.days, parts.hours, parts.minutes, parts.seconds],
  );

  if (!isValid) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-black/10 bg-white/70 px-5 py-6 text-sm text-black/60",
          className,
        )}
      >
        Countdown unavailable — invalid wedding date.
      </div>
    );
  }

  return (
    <div
      className={cn("flip-stage", className)}
      role="timer"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <FlipUnit
        value={isExpired ? 0 : parts.days}
        label="Days"
        accentColor={accentColor}
        unitKey="days"
      />
      <span className="flip-sep" aria-hidden="true">
        :
      </span>

      <FlipUnit
        value={isExpired ? 0 : parts.hours}
        label="Hours"
        accentColor={accentColor}
        unitKey="hours"
      />
      <span className="flip-sep" aria-hidden="true">
        :
      </span>

      <FlipUnit
        value={isExpired ? 0 : parts.minutes}
        label="Mins"
        accentColor={accentColor}
        unitKey="minutes"
      />
      <span className="flip-sep" aria-hidden="true">
        :
      </span>

      <FlipUnit
        value={isExpired ? 0 : parts.seconds}
        label="Secs"
        accentColor={accentColor}
        unitKey="seconds"
      />
    </div>
  );
}
