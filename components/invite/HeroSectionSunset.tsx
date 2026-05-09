"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";
import BokehParticles from "@/components/invite/BokehParticles";

interface HeroSectionSunsetProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

export default function HeroSectionSunset({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionSunsetProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current.querySelectorAll(".sunset-anim"),
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out" },
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const sunsetGradient =
    "linear-gradient(135deg, #C05A3A 0%, #E8A87C 30%, #F0D4B0 60%, #E8A87C 100%)";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Sunset gradient background ──────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #FDF5ED 0%, #F0D4B0 20%, #E8A87C 45%, #C05A3A 70%, #8B3A2A 100%)",
        }}
      />

      {/* ── Animated golden hour light shift ──────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,200,150,0.6) 0%, transparent 100%)",
          animation: "gold-shimmer 8s ease-in-out infinite",
          backgroundSize: "200% 200%",
        }}
      />

      {/* ── Bokeh particles ──────────────────────────────────────────── */}
      <BokehParticles
        count={30}
        colors={["#F0D4B0", "#E8A87C", "#C05A3A", "#FDF5ED", "#FFE0B2"]}
        speed={0.7}
      />

      {/* ── Hero photo with sunflare ──────────────────────────────────── */}
      {heroPhoto && (
        <div className="absolute inset-0 z-[1] opacity-30">
          <Image
            src={heroPhoto}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Sunflare overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(255,220,150,0.4) 0%, transparent 60%)",
            }}
          />
        </div>
      )}

      {/* ── Gradient overlay for readability ──────────────────────────── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(253,245,237,0.3) 0%, rgba(192,90,58,0.2) 50%, rgba(139,58,42,0.4) 100%)",
        }}
      />

      {/* ── Center content ──────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl w-full flex flex-col items-center justify-center min-h-[70vh]"
      >
        {/* Warm decorative divider */}
        <div className="sunset-anim flex items-center gap-3 mb-6">
          <div className="h-px w-16" style={{ background: sunsetGradient }} />
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: template.fonts.accent, color: "#8B3A2A" }}
          >
            Save the Date
          </span>
          <div className="h-px w-16" style={{ background: sunsetGradient }} />
        </div>

        {/* Couple Names with warm gradient */}
        <h1 className="sunset-anim flex flex-col items-center gap-2 mb-4">
          <span
            className="text-5xl sm:text-7xl md:text-8xl leading-none bg-clip-text text-transparent"
            style={{
              fontFamily: template.fonts.heading,
              backgroundImage: sunsetGradient,
              backgroundSize: "200% auto",
              animation: "gold-shimmer 4s ease-in-out infinite",
            }}
          >
            {couple.name1}
          </span>
          <span
            className="text-3xl sm:text-4xl italic font-light"
            style={{ fontFamily: template.fonts.accent, color: "#C05A3A" }}
          >
            &
          </span>
          <span
            className="text-5xl sm:text-7xl md:text-8xl leading-none bg-clip-text text-transparent"
            style={{
              fontFamily: template.fonts.heading,
              backgroundImage: sunsetGradient,
              backgroundSize: "200% auto",
              animation: "gold-shimmer 4s ease-in-out infinite",
              animationDelay: "0.5s",
            }}
          >
            {couple.name2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="sunset-anim text-base sm:text-lg md:text-xl tracking-wide mb-3"
          style={{
            fontFamily: template.fonts.body,
            color: "#5C2A1A",
            fontStyle: "italic",
          }}
        >
          are tying the knot during golden hour
        </p>

        {/* Date */}
        <p
          className="sunset-anim text-sm sm:text-base tracking-wider"
          style={{ fontFamily: template.fonts.accent, color: "#8B3A2A" }}
        >
          {new Date(weddingDate).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ── Countdown with warm glassmorphism ─────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="rounded-2xl border border-white/30 shadow-2xl"
          style={{
            background: "rgba(253,245,237,0.7)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(192,90,58,0.2)",
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor="#C05A3A"
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
          stroke="#C05A3A"
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
