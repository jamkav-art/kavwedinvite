"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/types/anniversary-order.types";
import { cn } from "@/lib/utils";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  onToggle: (id: string) => void;
  onUpdate: (
    id: string,
    data: Partial<Omit<QuizQuestion, "id" | "isCustom">>,
  ) => void;
  onRemove: (id: string) => void;
}

const OPTION_LABELS = ["A", "B", "C"] as const;

export default function QuizQuestionCard({
  question,
  index,
  onToggle,
  onUpdate,
  onRemove,
}: QuizQuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const gradientClass = `quiz-card-gradient-${index % 6}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "rounded-2xl border transition-all duration-200 overflow-hidden",
        question.enabled
          ? `${gradientClass} shadow-sm hover:shadow-md`
          : "opacity-55 bg-gray-100/30 border-gray-200",
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Toggle */}
        <button
          type="button"
          onClick={() => onToggle(question.id)}
          className={cn(
            "relative shrink-0 w-10 h-6 rounded-full transition-all duration-200",
            question.enabled ? "anniv-toggle-on" : "anniv-toggle-off",
          )}
          aria-label={question.enabled ? "Disable question" : "Enable question"}
        >
          <motion.div
            animate={{ x: question.enabled ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          />
        </button>

        {/* Question preview */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold anniversary-gradient-text">
            Q{index + 1}
          </p>
          <p className="text-sm font-medium text-[--color-charcoal] truncate">
            {question.text || "Untitled question"}
          </p>
        </div>

        {/* Expand / remove */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onRemove(question.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[--color-terracotta] hover:bg-red-50 transition-colors"
            aria-label="Remove question"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[--color-charcoal] hover:bg-gray-100 transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <motion.svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
              />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[--color-gold]/10 pt-3">
              {/* Question text */}
              <div>
                <label className="text-xs font-semibold anniversary-gradient-text mb-1 block">
                  Question
                </label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) =>
                    onUpdate(question.id, { text: e.target.value })
                  }
                  placeholder="Write your question..."
                  className="w-full px-3 py-2 rounded-xl border border-[--color-gold]/22 bg-[--color-blush]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-gold]/30 focus:border-[--color-gold] transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Options */}
              <div>
                <label className="text-xs font-semibold anniversary-gradient-text mb-1.5 block">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate(question.id, { correctAnswer: oi })
                        }
                        className={cn(
                          "shrink-0 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 px-3 transition-all min-w-[100px] h-9",
                          question.correctAnswer === oi
                            ? "anniv-option-btn shadow-md"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                        )}
                        aria-label={`Mark option ${OPTION_LABELS[oi]} as correct`}
                      >
                        <span>{OPTION_LABELS[oi]}</span>
                        {question.correctAnswer === oi && (
                          <span className="text-[10px] font-semibold text-green-300">
                            Correct Option
                          </span>
                        )}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...question.options];
                          next[oi] = e.target.value;
                          onUpdate(question.id, { options: next });
                        }}
                        placeholder={`Option ${OPTION_LABELS[oi]}...`}
                        className={cn(
                          "flex-1 px-3 py-2 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                          question.correctAnswer === oi
                            ? "border-[--color-gold]/40 bg-[--color-gold]/10"
                            : "border-gray-200 bg-white/60 focus:ring-[--color-gold]/30 focus:border-[--color-gold]",
                        )}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs anniversary-gradient-text mt-1.5 font-medium">
                  Tap the letter to mark the correct answer
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
