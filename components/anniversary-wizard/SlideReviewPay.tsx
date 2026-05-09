"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { useAnniversaryPayment } from "@/hooks/useAnniversaryPayment";
import { ANNIVERSARY_PRICE_DISPLAY } from "@/lib/anniversary-constants";

export default function SlideReviewPay() {
  // Use individual selectors instead of full store subscription
  // to prevent unnecessary re-renders on any store change.
  const anniversaryDate = useAnniversaryOrderStore((s) => s.anniversaryDate);
  const quizAnswers = useAnniversaryOrderStore((s) => s.quizBuilder.answers);
  const questions = useAnniversaryOrderStore((s) => s.questions);
  const couplePhoto = useAnniversaryOrderStore((s) => s.couplePhoto);
  const yourName = useAnniversaryOrderStore((s) => s.yourName);
  const partnerName = useAnniversaryOrderStore((s) => s.partnerName);
  const floralTheme = useAnniversaryOrderStore((s) => s.floralTheme);
  const backgroundMusic = useAnniversaryOrderStore((s) => s.backgroundMusic);
  const loveNote = useAnniversaryOrderStore((s) => s.loveNote);
  const prevStep = useAnniversaryOrderStore((s) => s.prevStep);
  const { initializePayment, isLoading } = useAnniversaryPayment();

  const yearsTogether = useMemo(() => {
    if (!anniversaryDate) return 0;
    const date = new Date(anniversaryDate);
    const today = new Date();
    let years = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      years--;
    }
    return Math.max(0, years);
  }, [anniversaryDate]);

  // Detect quiz mode: random (via quizBuilder) or custom (via custom questions in store)
  const randomQuestionCount = quizAnswers.length;
  const customQuestionsCount = questions.filter(
    (q) => q.isCustom && q.text.trim().length > 0,
  ).length;
  const questionCount =
    randomQuestionCount > 0 ? randomQuestionCount : customQuestionsCount;

  const handlePay = () => {
    if (isLoading) return;
    // Use getState() to read current store state at click time
    // instead of capturing it during render, avoiding full store subscription.
    const state = useAnniversaryOrderStore.getState();
    initializePayment(
      {
        yourName: state.yourName,
        partnerName: state.partnerName,
        anniversaryDate: state.anniversaryDate,
        yearsTogether: state.yearsTogether,
        couplePhoto: state.couplePhoto,
        questions: state.questions,
        floralTheme: state.floralTheme,
        colorMood: state.colorMood,
        customBgPhoto: state.customBgPhoto,
        loveNote: state.loveNote,
        voiceNote: state.voiceNote,
        backgroundMusic: state.backgroundMusic,
        customBackgroundMusic: state.customBackgroundMusic,
        phone: state.phone,
        email: state.email,
      },
      state.quizBuilder.answers,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      {/* Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl mb-6"
      >
        ✨
      </motion.div>

      {/* Title — gradient text */}
      <h1 className="font-serif text-2xl sm:text-3xl love-story-gradient mb-1 leading-snug">
        Your Love Story Quiz
      </h1>
      <p className="text-sm text-[#F5C6DA]/70 mb-6">
        Review & bring it to life
      </p>

      {/* Summary Card — glassmorphism on dark */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-4 mb-6 text-left"
      >
        {/* Couple */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C4497C]/30 to-[#D4AF37]/20 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
            {couplePhoto ? (
              <img
                src={couplePhoto.url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              "💑"
            )}
          </div>
          <div>
            <p className="font-serif text-lg text-[#F5C6DA]">
              {yourName || "You"} ❤️ {partnerName || "Them"}
            </p>
            {yearsTogether > 0 && (
              <p className="text-sm text-white/40">
                {yearsTogether} {yearsTogether === 1 ? "year" : "years"}{" "}
                together
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-[#C4497C]/20">
            <p className="text-xl font-bold text-[#C4497C]">{questionCount}</p>
            <p className="text-xs text-white/40">Questions</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#D4AF37]/15">
            <p className="text-xl font-bold text-[#D4AF37]">🎨</p>
            <p className="text-xs text-white/40">{floralTheme}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-[#7B5EA7]/20">
            <p className="text-xl font-bold text-[#7B5EA7]">🎵</p>
            <p className="text-xs text-white/40">
              {backgroundMusic ? "Music" : "No music"}
            </p>
          </div>
        </div>

        {/* Love note preview */}
        {loveNote && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/40 mb-1">💌 Love Note</p>
            <p className="text-sm text-[#F5C6DA]/70 italic line-clamp-2">
              "{loveNote}"
            </p>
          </div>
        )}
      </motion.div>

      {/* Price & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-[#D4AF37]/30">
          <span className="text-2xl font-bold font-serif text-[#D4AF37]">
            {ANNIVERSARY_PRICE_DISPLAY}
          </span>
          <span className="text-sm text-white/40">one-time</span>
        </div>

        {/* Pay Button — animated hero gradient */}
        <motion.button
          className={`w-full py-4 rounded-2xl font-semibold text-lg anniv-hero-cta-btn text-white shadow-lg shadow-[#C4497C]/30 hover:shadow-xl transition-all ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          onClick={handlePay}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Processing...
            </span>
          ) : (
            "Pay & Create ✨"
          )}
        </motion.button>

        {/* Back button */}
        <motion.button
          onClick={prevStep}
          className="w-full py-3 rounded-2xl font-medium text-sm text-white/30 hover:text-white/60 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          ← Edit something
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
