"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";
import GoldParticleEffect from "@/components/invite/GoldParticleEffect";

interface HeroSectionRoyalProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Mughal arch SVG ────────────────────────────────────────────────────
function MughalArch({
  color,
  goldColor,
}: {
  color: string;
  goldColor: string;
}) {
  return (
    <svg
      viewBox="0 0 500 600"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Outer arch */}
      <path
        d="M50 580 L50 200 Q50 20 250 20 Q450 20 450 200 L450 580"
        stroke={color}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      {/* Inner arch */}
      <path
        d="M70 580 L70 220 Q70 50 250 50 Q430 50 430 220 L430 580"
        stroke={goldColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Ornamental top */}
      <path
        d="M200 20 Q220 5 250 8 Q280 5 300 20"
        stroke={goldColor}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      {/* Side pillars */}
      <rect
        x="45"
        y="200"
        width="10"
        height="380"
        fill={color}
        opacity="0.4"
        rx="3"
      />
      <rect
        x="445"
        y="200"
        width="10"
        height="380"
        fill={color}
        opacity="0.4"
        rx="3"
      />
      {/* Pillar details */}
      <rect
        x="40"
        y="195"
        width="20"
        height="15"
        fill={goldColor}
        opacity="0.5"
        rx="2"
      />
      <rect
        x="440"
        y="195"
        width="20"
        height="15"
        fill={goldColor}
        opacity="0.5"
        rx="2"
      />
      {/* Hanging lamp */}
      <circle cx="250" cy="35" r="8" fill={goldColor} opacity="0.5" />
      <line
        x1="250"
        y1="27"
        x2="250"
        y2="20"
        stroke={goldColor}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Floor line */}
      <line
        x1="30"
        y1="580"
        x2="470"
        y2="580"
        stroke={goldColor}
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

export default function HeroSectionRoyal({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionRoyalProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Content fade-in
    if (contentRef.current) {
      tl.fromTo(
        contentRef.current.querySelectorAll(".royal-anim"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
        },
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      {/* ── Gold floral pattern overlay ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A962' fill-opacity='1'%3E%3Cpath d='M40 5C40 5 55 20 55 40C55 60 40 75 40 75C40 75 25 60 25 40C25 20 40 5 40 5Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* ── Gold particles ──────────────────────────────────────────── */}
      <GoldParticleEffect density="medium" speed={0.6} color="#C9A962" />

      {/* ── Hero photo (behind arch) ──────────────────────────────────── */}
      {heroPhoto && (
        <div className="absolute inset-0 z-0 opacity-25">
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

      {/* ── Gradient overlays ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${template.colors.background}00 0%, ${template.colors.background}60 50%, ${template.colors.background} 100%)`,
        }}
      />

      {/* ── Mughal arch ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div className="relative w-full max-w-lg aspect-[5/6]">
          <MughalArch
            color={template.colors.primary}
            goldColor={template.colors.secondary}
          />
        </div>
      </div>

      {/* ── Center content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-2xl w-full flex flex-col items-center justify-center min-h-[70vh]"
      >
        {/* Invitation text */}
        <p
          className="royal-anim text-xs tracking-[0.3em] uppercase mb-3"
          style={{
            fontFamily: template.fonts.accent,
            color: template.colors.secondary,
          }}
        >
          Together with their families
        </p>

        {/* Couple Names */}
        <h1
          className="royal-anim flex flex-col items-center gap-1 mb-4"
          style={{ fontFamily: template.fonts.heading }}
        >
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight"
            style={{ color: template.colors.primary }}
          >
            {couple.name1}
          </span>
          <span
            className="text-2xl sm:text-3xl"
            style={{
              fontFamily: template.fonts.accent,
              color: template.colors.secondary,
            }}
          >
            &bull;
          </span>
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight"
            style={{ color: template.colors.primary }}
          >
            {couple.name2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="royal-anim text-base sm:text-lg tracking-wider mb-3"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0.8,
          }}
        >
          Request the honor of your presence at their wedding
        </p>

        {/* Date */}
        <p
          className="royal-anim text-sm sm:text-base tracking-[0.25em] uppercase border-t border-b py-2 px-6"
          style={{
            fontFamily: template.fonts.accent,
            color: template.colors.secondary,
            borderColor: template.colors.secondary + "40",
          }}
        >
          {new Date(weddingDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ── Countdown ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: template.colors.secondary + "30",
            background: template.colors.background + "CC",
            backdropFilter: "blur(8px)",
            boxShadow: `0 4px 24px ${template.colors.secondary}20`,
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor={template.colors.secondary}
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
          stroke={template.colors.secondary}
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
