"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import type { TemplateConfig } from "@/types/template.types";
import CountdownTimer from "@/components/invite/CountdownTimer";

interface HeroSectionVintageProps {
  couple: { name1: string; name2: string };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ── Botanical corner SVG ornament ──────────────────────────────────────
function BotanicalCorner({
  color,
  flip,
}: {
  color: string;
  flip?: "h" | "v" | "hv";
}) {
  let transform = "";
  if (flip === "h") transform = "scale(-1, 1)";
  else if (flip === "v") transform = "scale(1, -1)";
  else if (flip === "hv") transform = "scale(-1, -1)";

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className="absolute"
      style={{ transform }}
    >
      {/* Curling vine */}
      <path
        d="M5 115 C5 80, 15 50, 40 30 C60 15, 80 10, 100 5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* Small leaves */}
      <ellipse
        cx="30"
        cy="40"
        rx="8"
        ry="4"
        fill={color}
        opacity="0.3"
        transform="rotate(-30 30 40)"
      />
      <ellipse
        cx="50"
        cy="22"
        rx="7"
        ry="3.5"
        fill={color}
        opacity="0.25"
        transform="rotate(-45 50 22)"
      />
      <ellipse
        cx="70"
        cy="14"
        rx="6"
        ry="3"
        fill={color}
        opacity="0.2"
        transform="rotate(-60 70 14)"
      />
      {/* Rose bud */}
      <circle cx="100" cy="10" r="6" fill={color} opacity="0.4" />
      <circle cx="100" cy="10" r="3" fill={color} opacity="0.6" />
    </svg>
  );
}

export default function HeroSectionVintage({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionVintageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  // ── GSAP entrance animation ──────────────────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    // Ornate border draw-in
    const borders = sectionRef.current?.querySelectorAll(".ornate-border-path");
    if (borders?.length) {
      tl.fromTo(
        borders,
        { strokeDashoffset: 500 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
        0,
      );
    }

    // Names stagger with letter-split effect
    const letters = namesRef.current?.querySelectorAll(".letter");
    if (letters?.length) {
      tl.fromTo(
        letters,
        { opacity: 0, y: 20, rotateX: -10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.5",
      );
    }

    // Subtitle
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      );
    }

    // Date
    if (dateRef.current) {
      tl.fromTo(
        dateRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.15",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const rosyGradient =
    "linear-gradient(135deg, #B5768A 0%, #C4957A 50%, #6B2D4A 100%)";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: template.colors.background }}
    >
      {/* ── Vintage botanical pattern overlay ────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B5768A' fill-opacity='0.4'%3E%3Cpath d='M30 5C30 5 20 15 15 25C10 35 15 45 20 50C25 55 30 55 30 55C30 55 35 55 40 50C45 45 50 35 45 25C40 15 30 5 30 5Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      {/* ── Ornate botanical borders ─────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Top-left */}
        <BotanicalCorner color={template.colors.primary} />
        {/* Top-right */}
        <div className="absolute top-0 right-0">
          <BotanicalCorner color={template.colors.primary} flip="h" />
        </div>
        {/* Bottom-left */}
        <div className="absolute bottom-0 left-0">
          <BotanicalCorner color={template.colors.primary} flip="v" />
        </div>
        {/* Bottom-right */}
        <div className="absolute bottom-0 right-0">
          <BotanicalCorner color={template.colors.primary} flip="hv" />
        </div>

        {/* Ornate oval frame (SVG border path for draw-in animation) */}
        <svg
          className="absolute inset-[10%] w-[80%] h-[80%] pointer-events-none"
          viewBox="0 0 400 500"
          fill="none"
        >
          <ellipse
            cx="200"
            cy="250"
            rx="180"
            ry="220"
            stroke={template.colors.primary}
            strokeWidth="1"
            strokeDasharray="500"
            strokeDashoffset="500"
            opacity="0.3"
            className="ornate-border-path"
          />
          <ellipse
            cx="200"
            cy="250"
            rx="190"
            ry="230"
            stroke={template.colors.secondary}
            strokeWidth="0.5"
            strokeDasharray="500"
            strokeDashoffset="500"
            opacity="0.2"
            className="ornate-border-path"
            style={{ animationDelay: "0.3s" }}
          />
        </svg>
      </div>

      {/* ── Hero photo with oval cutout ──────────────────────────────── */}
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

      {/* ── Gradient overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(180deg, ${template.colors.background}00 0%, ${template.colors.background}40 50%, ${template.colors.background} 100%)`,
        }}
      />

      {/* ── Center content ──────────────────────────────────────────── */}
      <div className="relative z-10 text-center px-6 max-w-3xl w-full flex flex-col items-center justify-center min-h-[70vh]">
        {/* Ornate header */}
        <div className="mb-4 flex items-center gap-4">
          <div className="h-px w-12" style={{ background: rosyGradient }} />
          <span
            className="text-xs tracking-[0.4em] uppercase"
            style={{
              color: template.colors.primary,
              fontFamily: template.fonts.accent,
            }}
          >
            Together with their families
          </span>
          <div className="h-px w-12" style={{ background: rosyGradient }} />
        </div>

        {/* Couple Names — letter split animation */}
        <div ref={namesRef} className="mb-4">
          <h1
            style={{
              fontFamily: template.fonts.heading,
              color: template.colors.text,
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.2,
            }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-4xl sm:text-6xl md:text-7xl">
              {couple.name1.split("").map((ch, i) => (
                <span
                  key={i}
                  className="letter"
                  style={{ display: "inline-block", opacity: 0 }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
            <span
              className="text-2xl sm:text-3xl md:text-4xl italic font-light tracking-wide"
              style={{
                fontFamily: template.fonts.accent,
                color: template.colors.primary,
              }}
            >
              &
            </span>
            <span className="text-4xl sm:text-6xl md:text-7xl">
              {couple.name2.split("").map((ch, i) => (
                <span
                  key={i}
                  className="letter"
                  style={{ display: "inline-block", opacity: 0 }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg tracking-wider mb-3"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          invite you to celebrate their wedding
        </p>

        {/* Date */}
        <p
          ref={dateRef}
          className="text-sm sm:text-base tracking-[0.3em] uppercase"
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

      {/* ── Countdown with vintage styling ───────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: template.colors.primary + "30",
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
          strokeWidth="1.5"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
