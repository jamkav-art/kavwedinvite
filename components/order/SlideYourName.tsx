"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

export default function SlideYourName() {
  const couple_name_1 = useOrderStore((s) => s.couple_name_1);
  const updateCouple = useOrderStore((s) => s.updateCouple);
  const nextStep = useOrderStore((s) => s.nextStep);

  const [value, setValue] = useState(couple_name_1);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = value.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter your name");
      return;
    }
    updateCouple({ couple_name_1: value.trim() });
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
      emoji="💍"
      heading="What's your name?"
      onContinue={handleContinue}
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
          placeholder="Your Full Name"
          className="wiz-glass-input w-full h-[52px] px-5 text-lg text-center placeholder:text-[var(--wiz-text-muted)]"
          autoComplete="name"
          aria-label="Your full name"
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
