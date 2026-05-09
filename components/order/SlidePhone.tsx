"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

const PHONE_REGEX = /^\+?[\d\s\-\(\)]{7,15}$/;

export default function SlidePhone() {
  const phone_number = useOrderStore((s) => s.phone_number);
  const updateContact = useOrderStore((s) => s.updateContact);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [value, setValue] = useState(phone_number);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = PHONE_REGEX.test(value.trim());

  const handleContinue = () => {
    if (!isValid) {
      setError("Please enter a valid phone number");
      return;
    }
    updateContact({ phone_number: value.trim() });
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
      emoji="📞"
      heading="Your phone number"
      onContinue={handleContinue}
      onBack={prevStep}
      showBack
      continueDisabled={!isValid && value.length > 0}
    >
      <div className="w-full space-y-2">
        <input
          ref={inputRef}
          type="tel"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="+1 (555) 123-4567"
          className="wiz-glass-input w-full h-[52px] px-5 text-lg text-center placeholder:text-[var(--wiz-text-muted)]"
          autoComplete="tel"
          aria-label="Phone number"
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
