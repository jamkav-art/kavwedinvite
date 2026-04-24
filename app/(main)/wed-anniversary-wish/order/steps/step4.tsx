"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { useAnniversaryPayment } from "@/hooks/useAnniversaryPayment";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import VoiceNoteRecorder from "@/components/anniversary-order/VoiceNoteRecorder";
import MusicTrackPicker from "@/components/anniversary-order/MusicTrackPicker";
import { step4Schema } from "@/lib/anniversary-order-validation";
import {
  ANNIVERSARY_PRICE_DISPLAY,
  ANNIVERSARY_PRICE,
} from "@/lib/anniversary-constants";
import { FLORAL_THEMES, COLOR_MOODS } from "@/lib/anniversary-themes";

type Step4Errors = Partial<Record<"loveNote" | "phone" | "email", string>>;

export default function Step4() {
  const store = useAnniversaryOrderStore();
  const { initializePayment, isLoading } = useAnniversaryPayment();
  const [errors, setErrors] = useState<Step4Errors>({});

  const enabledQuestions = store.questions.filter((q) => q.enabled);
  const currentTheme = FLORAL_THEMES[store.floralTheme];
  const currentMood = COLOR_MOODS[store.colorMood];

  const paymentDisabledReason = useMemo(() => {
    if (!store.yourName || !store.partnerName || !store.anniversaryDate) {
      return "Please complete Step 1 details.";
    }
    if (enabledQuestions.length < 5) {
      return "Please enable at least 5 questions in Step 2.";
    }
    const check = step4Schema.safeParse({
      loveNote: store.loveNote,
      voiceNote: store.voiceNote,
      backgroundMusic: store.backgroundMusic,
      phone: store.phone,
      email: store.email,
    });
    if (!check.success) return "Please complete contact details.";
    return null;
  }, [store, enabledQuestions.length]);

  const handlePay = async () => {
    const result = step4Schema.safeParse({
      loveNote: store.loveNote,
      voiceNote: store.voiceNote,
      backgroundMusic: store.backgroundMusic,
      phone: store.phone,
      email: store.email,
    });

    if (!result.success) {
      const nextErrors: Step4Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof Step4Errors;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    // Build voice blob URL if recording exists
    // In production, upload to Supabase storage before payment
    initializePayment({
      ...store,
      questions: store.questions,
    });
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold anniversary-gradient-text leading-tight">
          Your personal touch
        </h1>
        <p className="mt-1 text-sm text-[--color-charcoal]/55">
          Step 4 of 4 — a love note, voice, music, and payment
        </p>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 border border-gray-100 bg-white/50 space-y-2"
        style={{
          background: `linear-gradient(135deg, ${currentMood.secondary}, white)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentTheme.emoji}</span>
            <span className="text-sm font-semibold text-[--color-charcoal]">
              {store.yourName} & {store.partnerName}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {enabledQuestions.length} questions
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{currentTheme.label}</span>
          <span>&middot;</span>
          <span>{currentMood.label}</span>
          {store.anniversaryDate && (
            <>
              <span>&middot;</span>
              <span>
                {store.yearsTogether}{" "}
                {store.yearsTogether === 1 ? "year" : "years"}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Love note */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[--color-charcoal]">
          Love note{" "}
          <span className="text-xs text-gray-400 font-normal">
            (optional — appears after quiz result)
          </span>
        </label>
        <textarea
          value={store.loveNote}
          onChange={(e) => {
            store.updatePersonalMessage({ loveNote: e.target.value });
            if (errors.loveNote)
              setErrors((p) => ({ ...p, loveNote: undefined }));
          }}
          placeholder="Write a heartfelt message that will appear after your partner completes the quiz..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[--color-gold]/30 focus:border-[--color-gold] transition-all bg-white font-[var(--font-cormorant)] italic"
          maxLength={1000}
        />
        <div className="flex justify-between items-center">
          {errors.loveNote && (
            <p className="text-xs text-[--color-terracotta]">
              {errors.loveNote}
            </p>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {store.loveNote.length}/1000
          </span>
        </div>
      </div>

      {/* Voice note */}
      <VoiceNoteRecorder
        value={store.voiceNote}
        onChange={(blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            store.updatePersonalMessage({
              voiceNote: {
                name: "voice-note.webm",
                url,
                path: url,
                mimeType: "audio/webm",
                size: blob.size,
              },
            });
          } else {
            store.updatePersonalMessage({ voiceNote: null });
          }
        }}
      />

      {/* Background music */}
      <MusicTrackPicker
        value={store.backgroundMusic}
        onChange={(trackId) =>
          store.updatePersonalMessage({ backgroundMusic: trackId })
        }
        customAudio={
          store.customBackgroundMusic
            ? {
                url: store.customBackgroundMusic.url,
                name: store.customBackgroundMusic.name,
              }
            : null
        }
        onCustomAudioChange={(file) => {
          if (file) {
            const url = URL.createObjectURL(file);
            store.setCustomBackgroundMusic({
              name: file.name,
              url,
              path: url,
              mimeType: file.type,
              size: file.size,
            });
          } else {
            store.setCustomBackgroundMusic(null);
          }
        }}
      />

      {/* Contact details */}
      <div className="space-y-4 rounded-2xl p-4 border border-gray-100 bg-white">
        <h2 className="text-sm font-semibold text-[--color-charcoal]">
          Contact details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone number"
            type="tel"
            placeholder="9876543210"
            value={store.phone}
            onChange={(e) => store.updateContact({ phone: e.target.value })}
            error={errors.phone}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={store.email}
            onChange={(e) => store.updateContact({ email: e.target.value })}
            error={errors.email}
            required
          />
        </div>
      </div>

      {/* Pay section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 border border-gray-100 bg-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[--color-charcoal]">
              Anniversary Quiz
            </p>
            <p className="text-xs text-gray-400">
              {enabledQuestions.length} personalized questions
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold anniversary-gradient-text">
              {ANNIVERSARY_PRICE_DISPLAY}
            </p>
            <p className="text-[10px] text-gray-400">
              One-time &middot; No hidden fees
            </p>
          </div>
        </div>

        <Button
          onClick={handlePay}
          disabled={!!paymentDisabledReason}
          loading={isLoading}
          className="w-full h-14 text-base font-semibold cta-gradient-btn rounded-full"
          size="lg"
        >
          {paymentDisabledReason ||
            `Pay ${ANNIVERSARY_PRICE_DISPLAY} & Create Quiz`}
        </Button>
      </motion.div>

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
        <div />
      </div>
    </div>
  );
}
