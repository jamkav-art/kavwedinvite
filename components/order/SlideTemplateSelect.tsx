"use client";

import { useState } from "react";
import { useOrderStore } from "@/hooks/useOrderStore";
import { TEMPLATES } from "@/lib/templates";
import SlideSlideWrapper from "./SlideSlideWrapper";
import { motion } from "framer-motion";

const TEMPLATE_CARDS = TEMPLATES.map((t) => ({
  slug: t.slug,
  name: t.name,
  emoji: getTemplateEmoji(t.slug),
  mood: t.mood,
  colors: t.colors,
}));

function getTemplateEmoji(slug: string): string {
  const map: Record<string, string> = {
    "celestial-navy": "🪐",
    "vintage-rose": "🌹",
    "royal-gold": "👑",
    "sunset-terracotta": "🌅",
    "bohemian-wildflower": "🌸",
    "minimalist-mono": "⚫",
    "modern-sage": "🌿",
    "classic-ivory": "🤍",
  };
  return map[slug] || "✨";
}

export default function SlideTemplateSelect() {
  const template_slug = useOrderStore((s) => s.template_slug);
  const selectTemplate = useOrderStore((s) => s.selectTemplate);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [selected, setSelected] = useState(template_slug);

  const handleSelect = (slug: string) => {
    setSelected(slug);
    selectTemplate(slug);
  };

  return (
    <SlideSlideWrapper
      emoji="🎨"
      heading="Choose your style"
      onContinue={nextStep}
      onBack={prevStep}
      showBack
      continueDisabled={!selected}
      showContinueHint={false}
    >
      <div className="grid grid-cols-2 gap-3 w-full">
        {TEMPLATE_CARDS.map((card) => {
          const isSelected = selected === card.slug;
          return (
            <motion.button
              key={card.slug}
              onClick={() => handleSelect(card.slug)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer
                transition-all duration-300
                ${
                  isSelected
                    ? "border-2 shadow-lg"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }
              `}
              style={
                isSelected
                  ? {
                      borderColor: card.colors.primary,
                      boxShadow: `0 0 20px ${card.colors.primary}40`,
                      background: `rgba(255,255,255,0.08)`,
                    }
                  : undefined
              }
            >
              {/* Emoji */}
              <span className="text-2xl">{card.emoji}</span>

              {/* Name */}
              <span className="text-xs font-semibold text-[var(--wiz-text-primary)] leading-tight">
                {card.name}
              </span>

              {/* Mood */}
              <span className="text-[0.6rem] text-[var(--wiz-text-muted)] -mt-1">
                {card.mood}
              </span>

              {/* Color strip */}
              <div className="flex gap-1 mt-1">
                {[
                  card.colors.primary,
                  card.colors.secondary,
                  card.colors.accent,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-3 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--wiz-accent-gold)] rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[var(--wiz-bg-start)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </SlideSlideWrapper>
  );
}
