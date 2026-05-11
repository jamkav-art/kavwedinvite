// ============================================================================
// WEDINVITER pSEO — FAQ Accordion Section
// ============================================================================
"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface PageFAQsProps {
  faqs: FAQ[];
}

export function PageFAQs({ faqs }: PageFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-sm"
        >
          {/* Question Button */}
          <button
            onClick={() => toggleFAQ(index)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            aria-expanded={openIndex === index}
          >
            <span className="pr-4 text-sm font-medium text-gray-900">
              {faq.question}
            </span>
            <svg
              className={`size-5 shrink-0 text-gray-400 transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Answer Panel */}
          {openIndex === index && (
            <div className="border-t border-gray-100 px-5 py-4">
              <p className="text-sm leading-relaxed text-gray-600">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
