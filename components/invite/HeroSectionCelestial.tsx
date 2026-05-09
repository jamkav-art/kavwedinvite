"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";
import StarfieldParticles from "@/components/invite/StarfieldParticles";
import GoldParticleEffect from "@/components/invite/GoldParticleEffect";

interface HeroSectionCelestialProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

export default function HeroSectionCelestial({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionCelestialProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  // ── GSAP entrance animation ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Names stagger in
    const nameEls = namesRef.current?.querySelectorAll(".name-word");
    if (nameEls?.length) {
      tl.fromTo(
        nameEls,
        { opacity: 0, y: 40, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        },
      );
    }

    // Ampersand pop in
    const ampersand = namesRef.current?.querySelector(".ampersand");
    if (ampersand) {
      tl.fromTo(
        ampersand,
        { opacity: 0, scale: 0, rotation: -90 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(2.5)",
        },
        "-=0.3",
      );
    }

    // Tagline
    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      );
    }

    // Date
    if (dateRef.current) {
      tl.fromTo(
        dateRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.15",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0E1A]"
    >
      {/* ── Starfield background ─────────────────────────────────────── */}
      <StarfieldParticles
        density="high"
        speed={0.8}
        shootingStarInterval={6000}
      />

      {/* ── Gold sparkle particles ──────────────────────────────────── */}
      <GoldParticleEffect density="medium" speed={0.5} color="#C9A962" />

      {/* ── Hero photo overlay (if provided) ─────────────────────────── */}
      {heroPhoto && (
        <>
          <Image
            src={heroPhoto}
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A]/80 via-[#0A0E1A]/60 to-[#0A0E1A]/90 z-[1]" />
        </>
      )}

      {/* ── Subtle radial glow ──────────────────────────────────────── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A962]/5 blur-3xl pointer-events-none z-[1]" />

      {/* ── Center content ──────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-4xl w-full flex flex-col items-center justify-center min-h-[70vh]">
        {/* Couple names with gold gradient animation */}
        <div ref={namesRef} className="mb-6">
          <h1
            className="flex flex-col items-center gap-2"
            style={{ fontFamily: template.fonts.heading }}
          >
            <span
              className="name-word text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #C9A962 0%, #FFF8E7 30%, #C9A962 60%, #E8E0F0 100%)",
                backgroundSize: "200% auto",
                animation: "gold-shimmer 4s ease-in-out infinite",
                fontFamily: template.fonts.heading,
              }}
            >
              {couple.name1}
            </span>
            <span
              className="ampersand text-4xl sm:text-5xl md:text-6xl"
              style={{
                fontFamily: template.fonts.accent,
                color: "#C9A962",
                textShadow: "0 0 20px rgba(201,169,98,0.5)",
              }}
            >
              ✦
            </span>
            <span
              className="name-word text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #FFF8E7 0%, #C9A962 40%, #E8E0F0 70%, #C9A962 100%)",
                backgroundSize: "200% auto",
                animation: "gold-shimmer 4s ease-in-out infinite",
                animationDelay: "0.5s",
                fontFamily: template.fonts.heading,
              }}
            >
              {couple.name2}
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-lg sm:text-xl md:text-2xl tracking-[0.3em] uppercase mb-4"
          style={{
            fontFamily: template.fonts.accent,
            color: "#C9A962",
            opacity: 0,
            textShadow: "0 0 10px rgba(201,169,98,0.3)",
          }}
        >
          Are Getting Married
        </p>

        {/* Date */}
        <p
          ref={dateRef}
          className="text-base sm:text-lg tracking-widest uppercase"
          style={{
            fontFamily: template.fonts.body,
            color: "#E8E0F0",
            opacity: 0,
          }}
        >
          {new Date(weddingDate).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ── Countdown with glassmorphism ─────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="rounded-2xl border border-[#C9A962]/20 shadow-2xl"
          style={{
            background: "rgba(10,14,26,0.6)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(201,169,98,0.15)",
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor="#C9A962"
            className="!border-0 !bg-transparent"
          />
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <div className="absolute bottom-8 z-10 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A962"
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
