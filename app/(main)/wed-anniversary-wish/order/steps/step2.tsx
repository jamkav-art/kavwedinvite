"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { Button } from "@/components/ui/Button";
import QuizQuestionCard from "@/components/anniversary-order/QuizQuestionCard";
import { step2Schema } from "@/lib/anniversary-order-validation";

export default function Step2() {
  const store = useAnniversaryOrderStore();
  const [validationError, setValidationError] = useState("");

  const enabledCount = store.questions.filter((q) => q.enabled).length;
  const totalCount = store.questions.length;

  const handleNext = () => {
    const result = step2Schema.safeParse({ questions: store.questions });
    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? "Please fix the questions above.",
      );
      return;
    }
    setValidationError("");
    store.nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold love-story-gradient leading-tight">
          Build your quiz
        </h1>
        <p className="mt-1 text-sm anniversary-gradient-text">
          Step 2 of 4 — toggle, edit, and create questions about yourself.
          Choose your correct option for each question.
        </p>
      </div>

      {/* Counter badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold anniversary-gradient-text">
            {enabledCount} of {totalCount} questions selected
          </span>
          {enabledCount < 5 && (
            <span className="text-xs font-semibold text-[--color-terracotta] bg-[--color-terracotta]/10 px-2 py-0.5 rounded-full">
              (min 5 required)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => store.addCustomQuestion()}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-[--color-magenta]/10 to-[--color-gold]/10 text-[--color-magenta] border border-[--color-magenta]/20 hover:from-[--color-magenta]/20 hover:to-[--color-gold]/20 transition-all"
        >
          <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
            <path d="M6 1a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5H1.75a.75.75 0 010-1.5h3.5V1.75A.75.75 0 016 1z" />
          </svg>
          Add custom question
        </button>
      </div>

      {/* Validation error */}
      {validationError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="text-sm text-[--color-terracotta] flex items-center gap-1.5 font-medium"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 shrink-0"
          >
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          {validationError}
        </motion.p>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {store.questions.map((question, index) => (
            <QuizQuestionCard
              key={question.id}
              question={question}
              index={index}
              onToggle={store.toggleQuestion}
              onUpdate={store.updateQuestion}
              onRemove={store.removeQuestion}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {store.questions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 empty-state-colorful text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[--color-blush] to-[--color-gold]/20 flex items-center justify-center mb-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 text-[--color-magenta]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold anniversary-gradient-text">
            No questions yet
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Click "Add custom question" above to start
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button
          variant="secondary"
          onClick={store.prevStep}
          className="gap-1.5"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            />
          </svg>
          Back
        </Button>

        <Button
          onClick={handleNext}
          size="lg"
          className="gap-2 bg-gradient-to-r from-[#c0185f] to-[#c9a962] text-white shadow-md"
        >
          Continue to Theme
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
