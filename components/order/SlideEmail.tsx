"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SlideEmail() {
  const email = useOrderStore((s) => s.email);
  const updateContact = useOrderStore((s) => s.updateContact);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [value, setValue] = useState(email);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = EMAIL_REGEX.test(value.trim());

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter a valid email");
      return;
    }
    updateContact({ email: value.trim() });
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
      emoji="✉️"
      heading="Your email address"
      onContinue={handleContinue}
      onBack={prevStep}
      showBack
      continueDisabled={!isValid && value.length > 0}
    >
      <div className="w-full space-y-2">
        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="you@example.com"
          className="wiz-glass-input w-full h-[52px] px-5 text-lg text-center placeholder:text-[var(--wiz-text-muted)]"
          autoComplete="email"
          aria-label="Email address"
          inputMode="email"
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
