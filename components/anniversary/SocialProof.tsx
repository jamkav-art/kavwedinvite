"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { ANNIVERSARY_FEATURES } from "@/lib/anniversary-constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const CARD_PALETTES = [
  {
    bg: "rgba(255, 240, 245, 0.78)",
    shadow: "0 8px 32px rgba(232, 99, 140, 0.14)",
    iconBg: "bg-[--color-rose]/10",
    iconColor: "text-[--color-rose]",
  },
  {
    bg: "rgba(255, 248, 232, 0.78)",
    shadow: "0 8px 32px rgba(201, 169, 98, 0.18)",
    iconBg: "bg-[--color-gold]/10",
    iconColor: "text-[--color-gold]",
  },
  {
    bg: "rgba(245, 240, 255, 0.78)",
    shadow: "0 8px 32px rgba(192, 24, 95, 0.12)",
    iconBg: "bg-[--color-magenta]/10",
    iconColor: "text-[--color-magenta]",
  },
] as const;

export default function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-8% 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[--color-blush] py-16 md:py-24 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[--color-rose]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-[--color-gold]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-3">
            Why Couples Love This
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[--color-charcoal]">
            Made for moments that matter
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {ANNIVERSARY_FEATURES.map((feature, i) => {
            const palette = CARD_PALETTES[i];
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="p-6 sm:p-7 rounded-2xl glass-feature-card hover:scale-[1.02] transition-all duration-300"
                style={{ background: palette.bg, boxShadow: palette.shadow }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${palette.iconBg} flex items-center justify-center text-xl mb-4`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="font-[--font-cormorant] text-lg font-bold mb-2 text-[--color-charcoal]">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[--color-charcoal]/55 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
