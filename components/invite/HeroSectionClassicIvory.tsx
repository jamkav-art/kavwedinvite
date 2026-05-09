"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";

interface HeroSectionClassicIvoryProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Mandala frame SVG ──────────────────────────────────────────────────
function MandalaFrame({
  primaryColor,
  goldColor,
}: {
  primaryColor: string;
  goldColor: string;
}) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
      style={{ animation: "mandala-rotate 60s linear infinite" }}
    >
      {/* Outer ring — petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 200 + Math.cos(angle) * 190;
        const cy = 250 + Math.sin(angle) * 190;
        return (
          <ellipse
            key={`petal-${i}`}
            cx={cx}
            cy={cy}
            rx="20"
            ry="10"
            fill={goldColor}
            opacity="0.08"
            transform={`rotate(${i * 30}, ${cx}, ${cy})`}
          />
        );
      })}

      {/* Middle ring — kolam dots */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const cx = 200 + Math.cos(angle) * 150;
        const cy = 250 + Math.sin(angle) * 150;
        return (
          <circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r="3"
            fill={primaryColor}
            opacity="0.12"
          />
        );
      })}

      {/* Inner ring — small diamonds */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const cx = 200 + Math.cos(angle) * 100;
        const cy = 250 + Math.sin(angle) * 100;
        return (
          <rect
            key={`diamond-${i}`}
            x={cx - 4}
            y={cy - 4}
            width="8"
            height="8"
            fill={goldColor}
            opacity="0.1"
            transform={`rotate(${i * 22.5 + 45}, ${cx}, ${cy})`}
          />
        );
      })}

      {/* Center ornament */}
      <circle cx="200" cy="250" r="40" fill={goldColor} opacity="0.04" />
      <circle cx="200" cy="250" r="30" fill={goldColor} opacity="0.06" />
      <circle cx="200" cy="250" r="20" fill={primaryColor} opacity="0.05" />

      {/* Thoranam border — top decorative arch */}
      <path
        d="M80 30 Q100 5 120 20 Q140 5 160 20 Q180 5 200 10 Q220 5 240 20 Q260 5 280 20 Q300 5 320 30"
        stroke={goldColor}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M90 42 Q110 18 130 32 Q150 18 170 32 Q190 18 210 22 Q230 18 250 32 Q270 18 290 32 Q310 18 330 42"
        stroke={goldColor}
        strokeWidth="1"
        fill="none"
        opacity="0.2"
      />

      {/* Side thoranam lines */}
      <line
        x1="60"
        y1="50"
        x2="60"
        y2="450"
        stroke={goldColor}
        strokeWidth="1"
        opacity="0.15"
        strokeDasharray="4 4"
      />
      <line
        x1="340"
        y1="50"
        x2="340"
        y2="450"
        stroke={goldColor}
        strokeWidth="1"
        opacity="0.15"
        strokeDasharray="4 4"
      />

      {/* Bottom kolam band */}
      <path
        d="M80 470 L120 460 L160 470 L200 460 L240 470 L280 460 L320 470"
        stroke={primaryColor}
        strokeWidth="1.5"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M90 480 L130 472 L170 480 L210 472 L250 480 L290 472 L310 480"
        stroke={goldColor}
        strokeWidth="1"
        fill="none"
        opacity="0.15"
      />
    </svg>
  );
}

// ── Kolam rangoli corner pattern ────────────────────────────────────────
function KolamCorner() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className="opacity-[0.08]"
    >
      {/* Geometric kolam dots */}
      <circle cx="10" cy="10" r="2" fill="#8B4513" />
      <circle cx="20" cy="10" r="2" fill="#8B4513" />
      <circle cx="30" cy="10" r="2" fill="#8B4513" />
      <circle cx="10" cy="20" r="2" fill="#8B4513" />
      <circle cx="20" cy="20" r="3" fill="#C9A962" />
      <circle cx="30" cy="20" r="2" fill="#8B4513" />
      <circle cx="10" cy="30" r="2" fill="#8B4513" />
      <circle cx="20" cy="30" r="2" fill="#8B4513" />
      <circle cx="30" cy="30" r="2" fill="#8B4513" />

      {/* Lozenge shape */}
      <path d="M40 5 L50 15 L40 25 L30 15Z" fill="#C9A962" opacity="0.5" />
      <path d="M60 15 L65 20 L60 25 L55 20Z" fill="#8B4513" opacity="0.4" />
    </svg>
  );
}

export default function HeroSectionClassicIvory({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionClassicIvoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current.querySelectorAll(".ivory-anim"),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out" },
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
      {/* ── Kolam/rangoli geometric background pattern ────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B4513' fill-opacity='0.5'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='40' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='40' r='2'/%3E%3Ccircle cx='60' cy='40' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='40' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3Cg fill='%23C9A962' fill-opacity='0.3'%3E%3Cpath d='M40 40 L50 30 L60 40 L50 50Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "240px 240px",
        }}
      />

      {/* ── Mandala frame ─────────────────────────────────────────────── */}
      <MandalaFrame
        primaryColor={template.colors.primary}
        goldColor={template.colors.secondary}
      />

      {/* ── Hero photo (behind mandala) ─────────────────────────────────── */}
      {heroPhoto && (
        <div className="absolute inset-0 z-0 opacity-15">
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
          background: `linear-gradient(180deg, ${template.colors.background}CC 0%, ${template.colors.background}80 40%, ${template.colors.background}80 60%, ${template.colors.background}CC 100%)`,
        }}
      />

      {/* ── Kolam corner decorations ──────────────────────────────────── */}
      <div className="absolute top-4 left-4 z-[2]">
        <KolamCorner />
      </div>
      <div className="absolute top-4 right-4 z-[2]">
        <div style={{ transform: "scaleX(-1)" }}>
          <KolamCorner />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-[2]">
        <div style={{ transform: "scaleY(-1)" }}>
          <KolamCorner />
        </div>
      </div>
      <div className="absolute bottom-4 right-4 z-[2]">
        <div style={{ transform: "scale(-1, -1)" }}>
          <KolamCorner />
        </div>
      </div>

      {/* ── Center content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl w-full flex flex-col items-center justify-center min-h-[70vh]"
      >
        {/* Traditional invocation */}
        <p
          className="ivory-anim text-xs tracking-[0.4em] uppercase mb-4"
          style={{
            fontFamily: template.fonts.accent,
            color: template.colors.secondary,
          }}
        >
          &#x1F3F3; With divine blessings
        </p>

        {/* Couple Names */}
        <h1
          className="ivory-anim flex flex-col items-center gap-1 mb-5"
          style={{ fontFamily: template.fonts.heading }}
        >
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight font-semibold"
            style={{
              color: template.colors.primary,
              textShadow: "0 1px 2px rgba(139,69,19,0.1)",
            }}
          >
            {couple.name1}
          </span>
          <span
            className="text-lg sm:text-xl tracking-widest font-light"
            style={{
              fontFamily: template.fonts.accent,
              color: template.colors.secondary,
            }}
          >
            ✦ &bull; ✦
          </span>
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight font-semibold"
            style={{
              color: template.colors.primary,
              textShadow: "0 1px 2px rgba(139,69,19,0.1)",
            }}
          >
            {couple.name2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="ivory-anim text-base sm:text-lg tracking-wider mb-3 font-light italic"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0.8,
          }}
        >
          Request the pleasure of your company at their wedding
        </p>

        {/* Date with gold double border */}
        <div
          className="ivory-anim inline-block px-8 py-3 border-t border-b"
          style={{
            borderColor: template.colors.secondary,
            borderWidth: "2px",
          }}
        >
          <p
            className="text-sm sm:text-base tracking-[0.2em] uppercase"
            style={{
              fontFamily: template.fonts.accent,
              color: template.colors.primary,
            }}
          >
            {formattedDate}
          </p>
        </div>
      </div>

      {/* ── Countdown ────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="border-2 p-4"
          style={{
            borderColor: template.colors.secondary + "40",
            borderWidth: "1px",
            background: template.colors.background + "CC",
            backdropFilter: "blur(4px)",
            boxShadow: `0 2px 16px ${template.colors.secondary}15`,
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
          width="20"
          height="20"
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
