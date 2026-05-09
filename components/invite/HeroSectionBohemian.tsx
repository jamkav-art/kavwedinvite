"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";
import FloatingPetals from "@/components/invite/FloatingPetals";

interface HeroSectionBohemianProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Floral wreath frame SVG ──────────────────────────────────────────
function FloralWreathFrame({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Circular wreath */}
      <ellipse
        cx="200"
        cy="250"
        rx="160"
        ry="200"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
        strokeDasharray="8 4"
      />
      <ellipse
        cx="200"
        cy="250"
        rx="170"
        ry="210"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Small flowers around the wreath */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + Math.cos(rad) * 160;
        const cy = 250 + Math.sin(rad) * 200;
        return (
          <g key={i} opacity="0.5">
            <circle cx={cx} cy={cy} r="8" fill={color} opacity="0.3" />
            <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.6" />
            {[0, 72, 144, 216, 288].map((petalAngle) => {
              const pr = (petalAngle * Math.PI) / 180;
              return (
                <ellipse
                  key={petalAngle}
                  cx={cx + Math.cos(pr) * 6}
                  cy={cy + Math.sin(pr) * 6}
                  rx="4"
                  ry="2"
                  fill={color}
                  opacity="0.4"
                  transform={`rotate(${petalAngle}, ${cx}, ${cy})`}
                />
              );
            })}
          </g>
        );
      })}

      {/* Leaves */}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + Math.cos(rad) * 175;
        const cy = 250 + Math.sin(rad) * 215;
        return (
          <ellipse
            key={`leaf-${i}`}
            cx={cx}
            cy={cy}
            rx="10"
            ry="4"
            fill={color}
            opacity="0.25"
            transform={`rotate(${angle + 90}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

const BOHO_COLORS = ["#C45C8A", "#7BAE7F", "#F9D56E", "#E8A87C", "#F5E0E9"];

export default function HeroSectionBohemian({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionBohemianProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current.querySelectorAll(".boho-anim"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
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
      {/* ── Floating petals ──────────────────────────────────────────── */}
      <FloatingPetals
        count={25}
        colors={BOHO_COLORS}
        speed={0.8}
        petalSize={14}
      />

      {/* ── Wildflower scatter background ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='30' r='4' fill='%23C45C8A'/%3E%3Ccircle cx='80' cy='60' r='3' fill='%237BAE7F'/%3E%3Ccircle cx='50' cy='80' r='5' fill='%23F9D56E'/%3E%3Ccircle cx='30' cy='70' r='3' fill='%23C45C8A'/%3E%3Ccircle cx='70' cy='20' r='4' fill='%237BAE7F'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Hero photo ──────────────────────────────────────────────── */}
      {heroPhoto && (
        <div className="absolute inset-0 z-0 opacity-20">
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

      {/* ── Floral wreath frame ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <FloralWreathFrame color={template.colors.primary} />
      </div>

      {/* ── Gradient overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${template.colors.background}00 0%, ${template.colors.background}50 50%, ${template.colors.background} 100%)`,
        }}
      />

      {/* ── Center content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl w-full flex flex-col items-center justify-center min-h-[70vh]"
      >
        {/* Decorative header */}
        <div className="boho-anim flex items-center gap-2 mb-4">
          <span
            className="text-lg"
            style={{ color: template.colors.secondary }}
          >
            &#10047;
          </span>
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: template.fonts.accent,
              color: template.colors.primary,
            }}
          >
            Wildly in Love
          </span>
          <span
            className="text-lg"
            style={{ color: template.colors.secondary }}
          >
            &#10047;
          </span>
        </div>

        {/* Couple Names */}
        <h1
          className="boho-anim flex flex-col items-center gap-1 mb-4"
          style={{ fontFamily: template.fonts.heading }}
        >
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight"
            style={{
              color: template.colors.primary,
              textShadow: "0 2px 20px rgba(196,92,138,0.15)",
            }}
          >
            {couple.name1}
          </span>
          <span
            className="text-2xl sm:text-3xl font-light italic"
            style={{
              fontFamily: template.fonts.accent,
              color: template.colors.secondary,
            }}
          >
            &
          </span>
          <span
            className="text-4xl sm:text-6xl md:text-7xl leading-tight"
            style={{
              color: template.colors.primary,
              textShadow: "0 2px 20px rgba(196,92,138,0.15)",
            }}
          >
            {couple.name2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="boho-anim text-base sm:text-lg tracking-wide mb-3 italic"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0.8,
          }}
        >
          Together with their families, invite you to their wedding celebration
        </p>

        {/* Date */}
        <p
          className="boho-anim text-sm sm:text-base tracking-wide"
          style={{
            fontFamily: template.fonts.accent,
            color: template.colors.primary,
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
          className="rounded-2xl border p-4"
          style={{
            borderColor: template.colors.primary + "20",
            background: template.colors.background + "CC",
            backdropFilter: "blur(8px)",
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor={template.colors.primary}
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
          stroke={template.colors.primary}
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
