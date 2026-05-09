"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

function getDaysUntil(target: string): number {
  const now = new Date();
  const targetDate = new Date(target);
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isValidFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const maxDate = new Date(now);
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  return d >= now && d <= maxDate;
}

export default function SlideWeddingDate() {
  const wedding_date = useOrderStore((s) => s.wedding_date);
  const updateCouple = useOrderStore((s) => s.updateCouple);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [value, setValue] = useState(wedding_date);
  const [error, setError] = useState("");
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = isValidFutureDate(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    setError("");

    if (isValidFutureDate(newVal)) {
      setDaysUntil(getDaysUntil(newVal));
    } else {
      setDaysUntil(null);
    }
  };

  const handleContinue = () => {
    if (!isValid) {
      setError("Please select a valid date (today or within 2 years)");
      return;
    }
    updateCouple({ wedding_date: value });
    nextStep();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <SlideSlideWrapper
      emoji="📅"
      heading="When's the big day?"
      onContinue={handleContinue}
      onBack={prevStep}
      showBack
      continueDisabled={!isValid && value.length > 0}
    >
      <div className="w-full space-y-2">
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="wiz-glass-input w-full h-[52px] px-5 text-lg text-center text-[var(--wiz-text-primary)] [color-scheme:dark]"
          aria-label="Wedding date"
        />
        {daysUntil !== null && daysUntil > 0 && (
          <p className="text-sm text-[var(--wiz-accent-gold-light)]">
            ❤️ {daysUntil} days until the wedding!
          </p>
        )}
        {error && (
          <p className="text-xs text-[var(--wiz-accent-rose)] animate-pulse">
            {error}
          </p>
        )}
      </div>
    </SlideSlideWrapper>
  );
}
