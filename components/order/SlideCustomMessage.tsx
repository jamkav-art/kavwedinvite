"use client";

import { useState, useRef, useEffect } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import SlideSlideWrapper from "./SlideSlideWrapper";

const MAX_CHARS = 300;

export default function SlideCustomMessage() {
  const custom_message = useOrderStore((s) => s.custom_message);
  const updateContact = useOrderStore((s) => s.updateContact);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [value, setValue] = useState(custom_message);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const charCount = value.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.85;

  const getCounterColor = () => {
    if (isOverLimit) return "text-[var(--wiz-accent-rose)]";
    if (isNearLimit) return "text-[var(--wiz-accent-gold)]";
    return "text-[var(--wiz-text-muted)]";
  };

  const handleContinue = () => {
    updateContact({ custom_message: value.trim() });
    nextStep();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isOverLimit) handleContinue();
    }
  };

  return (
    <SlideSlideWrapper
      emoji="💌"
      heading="A personal message?"
      subheading="optional"
      onContinue={handleContinue}
      onBack={prevStep}
      showBack
      continueDisabled={isOverLimit}
      showContinueHint={false}
    >
      <div className="w-full space-y-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setValue(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Write your love note..."
          rows={4}
          className="wiz-glass-input w-full px-5 py-4 text-base text-center placeholder:text-[var(--wiz-text-muted)] resize-none"
          aria-label="Personal message"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--wiz-text-muted)]">
            {value.trim() ? "Enter to continue" : "optional"}
          </span>
          <span
            className={`text-xs font-medium transition-colors ${getCounterColor()}`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </SlideSlideWrapper>
  );
}
