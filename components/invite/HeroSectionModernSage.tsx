"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";

interface HeroSectionModernSageProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Botanical leaf SVG accent ────────────────────────────────────────────
function LeafAccent({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="inline-block"
    >
      <path
        d="M20 2 C20 2, 35 10, 35 25 C35 35, 25 38, 20 38 C15 38, 5 35, 5 25 C5 10, 20 2, 20 2Z"
        fill={color}
        opacity="0.15"
      />
      <path
        d="M20 6 C20 6, 30 12, 30 24 C30 32, 24 34, 20 34"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M20 10 L26 18 M20 14 L15 21 M20 18 L24 24"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

export default function HeroSectionModernSage({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionModernSageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const name1Ref = useRef<HTMLSpanElement>(null);
  const name2Ref = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  // ── GSAP entrance animation ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    // Left panel slides in from left
    if (leftRef.current) {
      tl.fromTo(
        leftRef.current,
        { opacity: 0, x: -60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      );
    }

    // Right panel slides in from right
    if (rightRef.current) {
      tl.fromTo(
        rightRef.current,
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      );
    }

    // Name 1
    if (name1Ref.current) {
      tl.fromTo(
        name1Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4",
      );
    }

    // Name 2
    if (name2Ref.current) {
      tl.fromTo(
        name2Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3",
      );
    }

    // Tagline
    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2",
      );
    }

    // Date
    if (dateRef.current) {
      tl.fromTo(
        dateRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.15",
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
      className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      {/* ── LEFT PANEL — Information ──────────────────────────────────── */}
      <div
        ref={leftRef}
        className="relative z-10 flex-1 flex flex-col items-center lg:items-start justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-0"
      >
        {/* Leaf decoration */}
        <div
          className="mb-6 leaf-sway"
          style={{ animation: "leaf-sway 4s ease-in-out infinite" }}
        >
          <LeafAccent color={template.colors.primary} />
        </div>

        {/* Couple names */}
        <h1
          className="flex flex-col items-center lg:items-start gap-1 mb-4"
          style={{ fontFamily: template.fonts.heading }}
        >
          <span
            ref={name1Ref}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-light"
            style={{
              color: template.colors.primary,
              opacity: 0,
            }}
          >
            {couple.name1}
          </span>
          <span
            className="text-lg sm:text-xl font-light tracking-widest lowercase"
            style={{
              fontFamily: template.fonts.body,
              color: template.colors.secondary,
            }}
          >
            &mdash; & &mdash;
          </span>
          <span
            ref={name2Ref}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-light"
            style={{
              color: template.colors.primary,
              opacity: 0,
            }}
          >
            {couple.name2}
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-sm sm:text-base tracking-wider uppercase mb-3"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.secondary,
            letterSpacing: "0.15em",
            opacity: 0,
          }}
        >
          Are delighted to invite you
        </p>

        {/* Date */}
        <p
          ref={dateRef}
          className="text-sm tracking-wide"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0,
          }}
        >
          {formattedDate}
        </p>

        {/* Botanical line divider */}
        <div
          className="w-16 h-px mt-8"
          style={{ backgroundColor: template.colors.primary, opacity: 0.3 }}
        />
      </div>

      {/* ── RIGHT PANEL — Photo ───────────────────────────────────────── */}
      <div
        ref={rightRef}
        className="relative flex-1 min-h-[40vh] lg:min-h-screen"
      >
        {heroPhoto ? (
          <>
            <Image
              src={heroPhoto}
              alt={`${couple.name1} & ${couple.name2}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Sage green gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${template.colors.primary}15 0%, transparent 50%, ${template.colors.secondary}10 100%)`,
              }}
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: template.colors.primary + "10" }}
          >
            <LeafAccent color={template.colors.primary} />
          </div>
        )}
      </div>

      {/* ── Countdown bar at bottom (desktop) ──────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 hidden lg:block">
        <div
          className="max-w-5xl mx-auto px-8 pb-8"
          style={{ fontFamily: template.fonts.body }}
        >
          <div
            className="border-t pt-4"
            style={{ borderColor: template.colors.border + "40" }}
          >
            <CountdownTimer
              weddingDate={weddingDate}
              accentColor={template.colors.primary}
              className="!border-0 !bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* ── Mobile countdown ──────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-6 pb-8 lg:hidden">
        <div
          className="border p-3"
          style={{
            borderColor: template.colors.border + "40",
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

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div className="absolute bottom-8 right-8 z-10 animate-bounce hidden lg:block">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={template.colors.primary}
          strokeWidth="1.5"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
