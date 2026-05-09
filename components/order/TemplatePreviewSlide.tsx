"use client";

import { motion } from "framer-motion";
import { TEMPLATES } from "@/lib/templates";
import type { OrderFormState } from "@/types/order.types";
import GradientAnimatedBorder from "./GradientAnimatedBorder";

interface TemplatePreviewSlideProps {
  templateSlug: string;
  userData: OrderFormState;
  onPay: (slug: string) => void;
  isActive: boolean;
}

export default function TemplatePreviewSlide({
  templateSlug,
  userData,
  onPay,
  isActive,
}: TemplatePreviewSlideProps) {
  const template = TEMPLATES.find((t) => t.slug === templateSlug);
  if (!template) return null;

  const {
    couple_name_1,
    couple_name_2,
    wedding_date,
    events,
    media,
    custom_message,
  } = userData;

  const photoCount = media.photos.filter(Boolean).length;
  const videoCount = media.videos.length;
  const eventCount = events.length;

  return (
    <GradientAnimatedBorder
      colors={{
        primary: template.colors.primary,
        secondary: template.colors.secondary,
        accent: template.colors.accent,
      }}
      className="w-full"
    >
      <div className="p-6 flex flex-col gap-4">
        {/* Template name + tagline */}
        <div className="text-center">
          <h3 className="text-lg font-semibold font-[var(--font-cormorant)] text-[var(--wiz-text-primary)]">
            {template.name}
          </h3>
          <p className="text-xs text-[var(--wiz-text-muted)] italic">
            {template.tagline}
          </p>
        </div>

        {/* Couple names */}
        <div className="text-center">
          <p className="text-xl font-semibold font-[var(--font-cormorant)] text-[var(--wiz-accent-gold)]">
            💍 {couple_name_1 || "You"} & {couple_name_2 || "Your Partner"}
          </p>
        </div>

        {/* Wedding date */}
        {wedding_date && (
          <p className="text-sm text-[var(--wiz-text-secondary)] text-center">
            📅{" "}
            {new Date(wedding_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {/* Summary stats */}
        <div className="flex justify-center gap-4 text-xs text-[var(--wiz-text-muted)]">
          <span>
            🎊 {eventCount} Event{eventCount !== 1 ? "s" : ""}
          </span>
          <span>
            📸 {photoCount} Photo{photoCount !== 1 ? "s" : ""}
          </span>
          {videoCount > 0 && (
            <span>
              🎥 {videoCount} Video{videoCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Custom message preview */}
        {custom_message && (
          <div className="text-center px-2">
            <p className="text-xs text-[var(--wiz-text-secondary)] italic line-clamp-2">
              💌 "{custom_message}"
            </p>
          </div>
        )}

        {/* Mood / style description */}
        <p className="text-xs text-[var(--wiz-text-muted)] text-center">
          {template.mood} · {template.description.split(".")[0]}.
        </p>

        {/* Pay Button */}
        {isActive && (
          <motion.button
            onClick={() => onPay(templateSlug)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-full h-[56px] rounded-2xl overflow-hidden font-semibold text-white mt-2"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--wiz-accent-burgundy)] via-[var(--wiz-accent-rose)] to-[var(--wiz-accent-gold)] bg-[length:200%_200%] animate-wiz-btn-glow" />

            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-wiz-shimmer-sweep" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Pay & Create Invitation
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </span>
          </motion.button>
        )}
      </div>
    </GradientAnimatedBorder>
  );
}
