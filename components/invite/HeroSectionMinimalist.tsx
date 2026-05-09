"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";

interface HeroSectionMinimalistProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Typewriter hook ──────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 40, delay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return displayed;
}

// ── Geometric accent shapes ─────────────────────────────────────────────
function GeometricAccents() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large circle top-right */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full"
        style={{ border: "1px solid rgba(0,0,0,0.04)" }}
      />
      {/* Small circle bottom-left */}
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
        style={{ border: "1px solid rgba(0,0,0,0.03)" }}
      />
      {/* Thin horizontal lines */}
      <div
        className="absolute top-1/4 right-0 w-64 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)",
        }}
      />
      <div
        className="absolute bottom-1/3 left-0 w-48 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)",
        }}
      />
      {/* Vertical accent */}
      <div
        className="absolute top-0 left-1/2 w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0,0,0,0.02), transparent)",
        }}
      />
    </div>
  );
}

export default function HeroSectionMinimalist({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionMinimalistProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const name1Ref = useRef<HTMLHeadingElement>(null);
  const name2Ref = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const geometricRef = useRef<HTMLDivElement>(null);

  const tagline = "are getting married";
  const typedTagline = useTypewriter(tagline, 50, 1200);

  // ── GSAP entrance animation ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.6 });

    // Geometric shapes fade in
    if (geometricRef.current) {
      tl.fromTo(
        geometricRef.current.querySelectorAll(".geom-anim"),
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        0,
      );
    }

    // Name 1 slides down from top
    if (name1Ref.current) {
      tl.fromTo(
        name1Ref.current,
        { opacity: 0, y: -60, rotationX: -15 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: "power3.out" },
        "-=0.4",
      );
    }

    // Name 2 slides up from bottom
    if (name2Ref.current) {
      tl.fromTo(
        name2Ref.current,
        { opacity: 0, y: 60, rotationX: 15 },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.9, ease: "power3.out" },
        "-=0.6",
      );
    }

    // Date with fade
    if (dateRef.current) {
      tl.fromTo(
        dateRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const formattedDate = new Date(weddingDate).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      {/* ── Geometric accents ─────────────────────────────────────────── */}
      <div ref={geometricRef}>
        <GeometricAccents />
      </div>

      {/* ── Hero photo (full-bleed option, very subtle) ────────────────── */}
      {heroPhoto && (
        <div className="absolute inset-0 z-0 opacity-[0.08]">
          <Image
            src={heroPhoto}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* ── Subtle gradient overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${template.colors.background}00 0%, ${template.colors.background}50 50%, ${template.colors.background} 100%)`,
        }}
      />

      {/* ── Center content — typography-first ──────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-5xl w-full flex flex-col items-center justify-center min-h-[70vh]">
        {/* Giant names — architectural typography */}
        <h1
          className="w-full flex flex-col items-center gap-0 leading-none mb-6 select-none"
          style={{ fontFamily: template.fonts.heading }}
        >
          <span
            ref={name1Ref}
            className="text-[clamp(3rem,12vw,10rem)] font-black tracking-tighter leading-none"
            style={{
              color: template.colors.primary,
              letterSpacing: "-0.04em",
              opacity: 0,
            }}
          >
            {couple.name1.toUpperCase()}
          </span>
          <span
            ref={name2Ref}
            className="text-[clamp(3rem,12vw,10rem)] font-black tracking-tighter leading-none mt-[-0.05em]"
            style={{
              color: template.colors.primary,
              letterSpacing: "-0.04em",
              opacity: 0,
            }}
          >
            {couple.name2.toUpperCase()}
          </span>
        </h1>

        {/* Typewriter tagline */}
        <div className="h-8 mb-4">
          <p
            className="text-base sm:text-lg md:text-xl tracking-[0.15em] uppercase font-light"
            style={{
              fontFamily: template.fonts.body,
              color: template.colors.secondary,
              fontStyle: "normal",
            }}
          >
            {typedTagline}
            <span
              className="inline-block w-[2px] h-[1em] ml-1 animate-pulse align-middle"
              style={{ backgroundColor: template.colors.primary }}
            />
          </p>
        </div>

        {/* Date — minimal */}
        <p
          ref={dateRef}
          className="text-xs sm:text-sm tracking-[0.2em] uppercase mt-2"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.secondary,
            opacity: 0,
            letterSpacing: "0.2em",
          }}
        >
          {formattedDate}
        </p>

        {/* Thin divider */}
        <div
          className="w-16 h-px mt-6 opacity-30"
          style={{ backgroundColor: template.colors.primary }}
        />
      </div>

      {/* ── Countdown — clean, minimal ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="border p-3"
          style={{
            borderColor: template.colors.border,
            background: template.colors.background,
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor={template.colors.primary}
            className="!border-0 !bg-transparent"
          />
        </div>
      </div>

      {/* ── Scroll indicator — minimal arrow ──────────────────────────── */}
      <div className="absolute bottom-8 z-10 animate-bounce">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={template.colors.secondary}
          strokeWidth="1.5"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
