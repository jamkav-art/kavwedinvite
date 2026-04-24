"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { QUIZ_PHASES } from "@/lib/anniversary-constants";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function VisualShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[--color-blush] py-16 md:py-24 overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[--color-gold]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-[--color-rose]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-3">
            See the magic in action
          </p>
          <h2 className="font-[--font-cormorant] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-[--color-charcoal]">
            A Glimpse of Your Quiz
          </h2>
        </motion.div>

        {/* Mobile horizontal scroll snap — hidden on md+ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          {QUIZ_PHASES.map((phase) => (
            <motion.div
              key={phase.label}
              variants={cardVariants}
              className="snap-center shrink-0 w-[72vw] max-w-[280px]"
            >
              <div className="quiz-phone-mockup rounded-3xl overflow-hidden bg-white shadow-xl">
                {/* Phone top bar */}
                <div className="flex items-center justify-center pt-3 pb-1">
                  <div className="w-20 h-1.5 rounded-full bg-gray-300" />
                </div>
                {/* Mockup screen */}
                <div
                  className={`bg-gradient-to-b ${phase.gradient} aspect-[9/16] flex flex-col items-center justify-center p-5 text-center`}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">
                    {phase.label}
                  </span>
                  <p className="font-[--font-cormorant] text-white text-xl font-semibold leading-snug">
                    {phase.sub}
                  </p>
                  <div className="mt-4 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                    <span className="text-white/80 text-lg">♥</span>
                  </div>
                </div>
                {/* Phone bottom bar */}
                <div className="flex items-center justify-center py-2">
                  <div className="w-24 h-1 rounded-full bg-gray-300" />
                </div>
              </div>
              <p className="text-center mt-3 text-sm font-medium text-[--color-charcoal]">
                {phase.title}
              </p>
              <p className="text-center text-xs text-[--color-charcoal]/45 mt-0.5">
                {phase.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Desktop 3-column grid — hidden on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="hidden md:grid md:grid-cols-3 gap-8 items-start"
        >
          {QUIZ_PHASES.map((phase, i) => (
            <motion.div
              key={phase.label}
              variants={cardVariants}
              className={`flex flex-col items-center ${i === 1 ? "md:translate-y-6" : ""} ${i === 2 ? "md:translate-y-3" : ""}`}
            >
              <div
                className={`quiz-phone-mockup rounded-3xl overflow-hidden bg-white shadow-xl w-full max-w-[260px] mx-auto ${i === 0 ? "float-card-a" : i === 1 ? "float-card-b" : "float-card-c"}`}
              >
                {/* Phone top bar */}
                <div className="flex items-center justify-center pt-3 pb-1">
                  <div className="w-20 h-1.5 rounded-full bg-gray-300" />
                </div>
                {/* Mockup screen */}
                <div
                  className={`bg-gradient-to-b ${phase.gradient} aspect-[9/16] flex flex-col items-center justify-center p-5 text-center`}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">
                    {phase.label}
                  </span>
                  <p className="font-[--font-cormorant] text-white text-xl font-semibold leading-snug">
                    {phase.sub}
                  </p>
                  <div className="mt-4 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                    <span className="text-white/80 text-lg">♥</span>
                  </div>
                </div>
                {/* Phone bottom bar */}
                <div className="flex items-center justify-center py-2">
                  <div className="w-24 h-1 rounded-full bg-gray-300" />
                </div>
              </div>
              <p className="text-center mt-4 text-sm font-semibold text-[--color-charcoal]">
                {phase.title}
              </p>
              <p className="text-center text-xs text-[--color-charcoal]/45 mt-1 max-w-[200px]">
                {phase.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
