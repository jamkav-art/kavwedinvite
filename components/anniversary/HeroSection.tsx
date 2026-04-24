"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ANNIVERSARY_PRICE_DISPLAY,
  ANNIVERSARY_ORDER_ROUTE,
} from "@/lib/anniversary-constants";

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 8.3 + 2) % 100}%`,
  size: 6 + ((i * 5) % 12),
  delay: (i * 0.7) % 4,
  duration: 5 + ((i * 0.6) % 4),
}));

const TITLE_WORDS = [
  { text: "Celebrate", line: 1 },
  { text: "Your", line: 1 },
  { text: "Love", line: 1 },
  { text: "with", line: 1 },
  { text: "a", line: 2 },
  { text: "Personalized", line: 2 },
  { text: "Anniversary", line: 2 },
  { text: "Quiz", line: 2 },
];

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  useLayoutEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-aq-hero-char]",
        titleRef.current!,
      );
      gsap.fromTo(
        chars,
        { autoAlpha: 0, y: 40, rotateX: -55, scale: 0.85 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.05,
          duration: 0.85,
          ease: "back.out(1.6)",
          delay: 0.2,
        },
      );
    }, titleRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff5f5] via-[#fef3e2] to-[#fbf7f0] pt-16"
    >
      {/* Floating golden petal particles */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {PETALS.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute rounded-full"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size * 1.4,
              background:
                "linear-gradient(180deg, rgba(201,169,98,0.5) 0%, rgba(247,231,206,0.3) 100%)",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -(viewportHeight * (0.6 + (petal.id % 3) * 0.2))],
              x: [
                0,
                (petal.id % 2 === 0 ? 1 : -1) * (20 + (petal.id % 5) * 15),
              ],
              rotate: [0, 360 + petal.id * 45],
              opacity: [0, 0.6, 0.4, 0],
            }}
            transition={{
              duration: petal.duration + 2,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Decorative gradient border rings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[15%] right-[10%] w-56 h-56 rounded-full hero-ring"
          style={
            { "--ring-dur": "12s", "--ring-delay": "0s" } as React.CSSProperties
          }
        />
        <div
          className="absolute top-[10%] right-[3%] w-[400px] h-[400px] rounded-full hero-ring"
          style={
            {
              "--ring-dur": "18s",
              "--ring-delay": "-6s",
            } as React.CSSProperties
          }
        />
        <div
          className="absolute bottom-[25%] left-[5%] w-40 h-40 rounded-full hero-ring"
          style={
            { "--ring-dur": "8s", "--ring-delay": "-3s" } as React.CSSProperties
          }
        />
      </div>

      {/* Floral ornaments */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="absolute top-[10%] left-[3%] font-[--font-cormorant] text-[7rem] leading-none ornament-drift hero-floral-ornament">
          ❧
        </div>
        <div
          className="absolute bottom-[18%] right-[3%] font-[--font-cormorant] text-[7rem] leading-none rotate-180 ornament-drift-slow hero-floral-ornament"
          style={{ animationDelay: "-4s" }}
        >
          ❧
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-5"
        >
          WedInviter Anniversary Quiz
        </motion.p>

        {/* Headline — character stagger with GSAP */}
        <h1
          ref={titleRef}
          className="font-[--font-cormorant] text-[clamp(2rem,5.5vw+0.5rem,4.2rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-5 [perspective:1200px] [transform-style:preserve-3d]"
          aria-label="Celebrate Your Love with a Personalized Anniversary Quiz"
        >
          {/* Line 1 */}
          {TITLE_WORDS.filter((w) => w.line === 1).map((word, i) => (
            <span
              key={`l1-${word.text}`}
              data-aq-hero-char
              className="inline-block mr-[0.28em] will-change-transform anniversary-gradient-text"
              style={{ animationDelay: `${i * -1.5}s` }}
            >
              {word.text}
            </span>
          ))}
          <br />
          {/* Line 2 */}
          {TITLE_WORDS.filter((w) => w.line === 2).map((word, i) => (
            <span
              key={`l2-${word.text}`}
              data-aq-hero-char
              className="inline-block mr-[0.28em] will-change-transform anniversary-gradient-text"
              style={{ animationDelay: `${(i + 4) * -1.5}s` }}
            >
              {word.text}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-[--color-charcoal]/55 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Test how well they know you. Create a magical, interactive memory in
          just 5 minutes.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            href={ANNIVERSARY_ORDER_ROUTE}
            className="inline-flex items-center justify-center gap-2 h-14 px-9 rounded-full cta-gradient-btn text-white font-semibold text-base tracking-wide anniversary-heartbeat-btn shadow-lg"
          >
            Create Your Anniversary Quiz
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 13,
                delay: 1.3,
              }}
              className="inline-flex items-center justify-center bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm"
            >
              {ANNIVERSARY_PRICE_DISPLAY}
            </motion.span>
          </Link>

          {/* Trust / Price label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-xs text-[--color-charcoal]/45 flex flex-wrap justify-center gap-x-3 gap-y-1"
          >
            <span>Only {ANNIVERSARY_PRICE_DISPLAY}</span>
            <span className="hidden xs:inline">•</span>
            <span>One-time payment</span>
            <span className="hidden xs:inline">•</span>
            <span>No hidden fees</span>
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-[--color-gold]/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[--color-gold]/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
