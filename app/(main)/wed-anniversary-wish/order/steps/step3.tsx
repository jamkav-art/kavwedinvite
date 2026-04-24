"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAnniversaryOrderStore } from "@/hooks/useAnniversaryOrderStore";
import { Button } from "@/components/ui/Button";
import ThemeSelector from "@/components/anniversary-order/ThemeSelector";
import ColorMoodPicker from "@/components/anniversary-order/ColorMoodPicker";
import PhotoUploadDropzone from "@/components/anniversary-order/PhotoUploadDropzone";
import MusicTrackPicker from "@/components/anniversary-order/MusicTrackPicker";
import { FLORAL_THEMES, COLOR_MOODS } from "@/lib/anniversary-themes";
import { step3Schema } from "@/lib/anniversary-order-validation";
import type { FloralTheme, ColorMood } from "@/types/anniversary-order.types";

export default function Step3() {
  const store = useAnniversaryOrderStore();
  const [error, setError] = useState("");

  const handleThemeChange = (theme: FloralTheme) => {
    store.setFloralTheme(theme);
    setError("");
  };

  const handleMoodChange = (mood: ColorMood) => {
    store.setColorMood(mood);
    setError("");
  };

  const handleNext = () => {
    const result = step3Schema.safeParse({
      floralTheme: store.floralTheme,
      colorMood: store.colorMood,
    });
    if (!result.success) {
      setError("Please select both a floral theme and a color mood.");
      return;
    }
    setError("");
    store.nextStep();
  };

  const currentTheme = FLORAL_THEMES[store.floralTheme];
  const currentMood = COLOR_MOODS[store.colorMood];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold love-story-gradient leading-tight">
          Theme & Music
        </h1>
        <p className="mt-1 text-sm text-[--color-charcoal]/55">
          Step 3 of 4 — choose floral theme, color mood, background photo, and
          music
        </p>
      </div>

      {/* Live preview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 border border-gray-100 bg-white/50"
        style={{
          background: `linear-gradient(135deg, ${currentMood.secondary}, white)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `linear-gradient(135deg, ${currentMood.primary}, ${currentMood.accent})`,
            }}
          >
            <span className="text-white text-lg">{currentTheme.emoji}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[--color-charcoal]">
              {currentTheme.label} &middot; {currentMood.label}
            </p>
            <p className="text-xs text-gray-400">{currentTheme.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Floral theme selector */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[--color-charcoal]">
          Floral theme
        </h2>
        <ThemeSelector value={store.floralTheme} onChange={handleThemeChange} />
      </div>

      {/* Color mood selector */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[--color-charcoal]">
          Color mood
        </h2>
        <ColorMoodPicker value={store.colorMood} onChange={handleMoodChange} />
      </div>

      {/* Background Music */}
      <div className="space-y-3">
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
      </div>

      {/* Custom BG photo */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-[--color-charcoal]">
          Custom background photo{" "}
          <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </h2>
        <PhotoUploadDropzone
          value={store.customBgPhoto}
          onChange={(file) => {
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              store.setCustomBgPhoto({
                name: file.name,
                url: previewUrl,
                path: previewUrl,
                mimeType: file.type,
                size: file.size,
              });
            } else {
              store.setCustomBgPhoto(null);
            }
          }}
          label="Upload your background photo"
          hint="This becomes the backdrop of your quiz page"
        />
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="text-sm text-[--color-terracotta] flex items-center gap-1.5"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 shrink-0"
          >
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
          </svg>
          {error}
        </motion.p>
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

        <Button onClick={handleNext} size="lg" className="gap-2">
          Continue to Message
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
