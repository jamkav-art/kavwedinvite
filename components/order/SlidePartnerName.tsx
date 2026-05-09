"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

export default function SlidePartnerName() {
  const couple_name_2 = useOrderStore((s) => s.couple_name_2);
  const updateCouple = useOrderStore((s) => s.updateCouple);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [value, setValue] = useState(couple_name_2);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = value.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter your partner's name");
      return;
    }
    updateCouple({ couple_name_2: value.trim() });
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
      emoji="👰"
      heading="Your partner's name?"
      onContinue={handleContinue}
      onBack={prevStep}
      showBack
      continueDisabled={!isValid && value.length > 0}
    >
      <div className="w-full space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Partner's Name"
          className="wiz-glass-input w-full h-[52px] px-5 text-lg text-center placeholder:text-[var(--wiz-text-muted)]"
          autoComplete="name"
          aria-label="Partner's full name"
        />
        {error && (
          <p className="text-xs text-[var(--wiz-accent-rose)] animate-pulse">
            {error}
          </p>
        )}
      </div>
    </SlideSlideWrapper>
  );
}
