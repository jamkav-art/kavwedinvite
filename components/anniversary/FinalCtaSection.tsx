"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ANNIVERSARY_PRICE_DISPLAY,
  ANNIVERSARY_ORDER_ROUTE,
} from "@/lib/anniversary-constants";

export default function FinalCtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[--color-blush] via-white to-[--color-cream]"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[--color-gold]/5 rounded-full blur-3xl" />
        <div
          className="absolute top-[30%] right-[10%] w-40 h-40 rounded-full hero-ring"
          style={
            { "--ring-dur": "10s", "--ring-delay": "0s" } as React.CSSProperties
          }
        />
        <div
          className="absolute bottom-[20%] left-[8%] w-32 h-32 rounded-full hero-ring"
          style={
            { "--ring-dur": "8s", "--ring-delay": "-3s" } as React.CSSProperties
          }
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Floral ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="font-[--font-cormorant] text-5xl leading-none text-[--color-gold]/40 mb-6"
          aria-hidden="true"
        >
          ❧
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-[--font-cormorant] text-[clamp(2rem,5vw,3.5rem)] font-semibold text-[--color-charcoal] leading-tight mb-4"
        >
          Ready to surprise
          <br />
          your dearest person?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base sm:text-lg text-[--color-charcoal]/55 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Create a beautiful, personalized quiz that celebrates your unique love
          story.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            href={ANNIVERSARY_ORDER_ROUTE}
            className="inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full cta-gradient-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg"
          >
            Start Building Your Quiz
            <span className="inline-flex items-center justify-center bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              {ANNIVERSARY_PRICE_DISPLAY}
            </span>
          </Link>

          {/* Trust label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xs text-[--color-charcoal]/45"
          >
            Only {ANNIVERSARY_PRICE_DISPLAY} &middot; One-time payment &middot;
            No hidden fees
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
