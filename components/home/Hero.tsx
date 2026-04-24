"use client";

import { useRef, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAPTimeline } from "@/hooks/useGSAPTimeline";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), {
  ssr: false,
});

const TEMPLATE_PREVIEWS = [
  {
    slug: "royal-gold",
    name: "Royal Gold",
    primary: "#8B1A1A",
    accent: "#C9A962",
    tag: "Most Popular",
  },
  {
    slug: "celestial-navy",
    name: "Celestial Navy",
    primary: "#1B2C4E",
    accent: "#C9A962",
    tag: "Best Seller",
  },
  {
    slug: "bohemian-wildflower",
    name: "Bohemian",
    primary: "#C45C8A",
    accent: "#7BAE7F",
    tag: "Trending",
  },
];

// All hero-specific CSS lives here so ONLY this file needs editing.
// Uses @property for animatable custom properties (Chrome 85+, FF 128+, Safari 15.4+).
// bridal-shimmer keyframe comes from globals.css (added by Header task).
const HERO_CSS = `
  @property --ring-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
  }
  @property --floral-a { syntax: '<color>'; inherits: false; initial-value: #C0185F; }
  @property --floral-b { syntax: '<color>'; inherits: false; initial-value: #E8638C; }
  @property --floral-c { syntax: '<color>'; inherits: false; initial-value: #C9A962; }

  /* ── Gradient ring border (CSS mask-composite trick) ─────────── */
  .hero-ring { position: relative; }
  .hero-ring::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(
      from var(--ring-angle),
      #C0185F 0%, #E8638C 15%, #C9A962 35%,
      #F7E7CE 55%, #9B59B6 70%, #E8638C 85%, #C0185F 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    animation: hero-ring-spin var(--ring-dur, 10s) linear infinite var(--ring-delay, 0s);
  }
  @keyframes hero-ring-spin { to { --ring-angle: 360deg; } }

  /* ── Floral ornament cross-fade (❧ characters) ───────────────── */
  .hero-floral-ornament {
    background: linear-gradient(135deg, var(--floral-a), var(--floral-b), var(--floral-c));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    opacity: 0.82;
    animation: hero-floral-fade 6s ease-in-out infinite;
  }
  @keyframes hero-floral-fade {
    0%, 100% { --floral-a: #C0185F; --floral-b: #E8638C;  --floral-c: #C9A962; }
    33%      { --floral-a: #C9A962; --floral-b: #F7E7CE;  --floral-c: #9B59B6; }
    66%      { --floral-a: #7BAE7F; --floral-b: #C45C8A;  --floral-c: #C9A962; }
  }

  /* ── Unique animated gradient for primary CTA button ────── */
  @keyframes hero-btn-shimmer {
    0%   { background-position: 0% 50%; }
    25%  { background-position: 100% 0%; }
    50%  { background-position: 100% 100%; }
    75%  { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }
  .hero-primary-btn {
    background: linear-gradient(
      135deg,
      #1a1a2e 0%, #16213e 15%, #0f3460 30%,
      #533483 50%, #0f3460 70%, #16213e 85%, #1a1a2e 100%
    );
    background-size: 400% 400%;
    animation: hero-btn-shimmer 6s ease-in-out infinite;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .hero-primary-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.12) 0%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0.06) 60%,
      rgba(255,255,255,0) 100%
    );
    pointer-events: none;
  }

  /* ── Headline gradient text fill ────────────────────────────── */
  .hero-title-word {
    background: linear-gradient(
      135deg,
      #C0185F 0%, #E8638C 18%, #C9A962 36%,
      #F7E7CE 50%, #C9A962 64%, #9B59B6 82%, #C0185F 100%
    );
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation: bridal-shimmer 7s ease-in-out infinite;
  }

  /* ── Hero "Wedding Anniversary Quiz" CTA — unique animated gradient ── */
  @keyframes hero-quiz-shimmer {
    0%   { background-position: 0% 50%; }
    25%  { background-position: 100% 25%; }
    50%  { background-position: 50% 100%; }
    75%  { background-position: 0% 75%; }
    100% { background-position: 0% 50%; }
  }
  .hero-quiz-btn {
    background: linear-gradient(
      135deg,
      #2c0a3e 0%, #5c2a7a 18%, #c0185f 38%,
      #c9a962 58%, #c0185f 72%, #5c2a7a 86%, #2c0a3e 100%
    );
    background-size: 400% 400%;
    animation: hero-quiz-shimmer 7s ease-in-out infinite;
    position: relative;
    overflow: hidden;
  }
  .hero-quiz-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.15) 0%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0.08) 60%,
      rgba(255,255,255,0) 100%
    );
    pointer-events: none;
  }
`;

export default function Hero() {
  useGSAPTimeline();

  const titleRef = useRef<HTMLHeadingElement>(null);

  // Enhanced 3D stagger: scale + depth added to the existing rotateX entrance
  useLayoutEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-hero-char]",
        titleRef.current!,
      );
      gsap.fromTo(
        chars,
        { autoAlpha: 0, y: 44, rotateX: -65, scale: 0.82 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.9,
          ease: "back.out(1.7)",
          delay: 0.15,
        },
      );
    }, titleRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Scoped styles — kept inside this component file per directive */}
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient-bg pt-16">
        <ParticleCanvas />

        {/* Decorative background elements */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          {/* Animated gradient-border rings — replaces plain border-gold divs */}
          <div
            className="absolute top-1/4 right-[8%] w-72 h-72 rounded-full hero-ring"
            style={
              {
                "--ring-dur": "10s",
                "--ring-delay": "0s",
              } as React.CSSProperties
            }
          />
          <div
            className="absolute top-[18%] right-[5%] w-[480px] h-[480px] rounded-full hero-ring"
            style={
              {
                "--ring-dur": "16s",
                "--ring-delay": "-5s",
              } as React.CSSProperties
            }
          />
          <div
            className="absolute bottom-1/4 left-[6%] w-48 h-48 rounded-full hero-ring"
            style={
              {
                "--ring-dur": "7s",
                "--ring-delay": "-2s",
              } as React.CSSProperties
            }
          />

          {/* Floral ornament ❧ — cross-fades between bridal color schemes every ~2s */}
          <div className="absolute top-[12%] left-[4%] font-[--font-cormorant] text-[9rem] leading-none ornament-drift hero-floral-ornament">
            ❧
          </div>
          <div
            className="absolute bottom-[15%] right-[4%] font-[--font-cormorant] text-[9rem] leading-none rotate-180 ornament-drift-slow hero-floral-ornament"
            style={{ animationDelay: "-3s" }}
          >
            ❧
          </div>
        </div>

        {/* Floating glass cards — left */}
        <div
          className="absolute left-[2.5%] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-5 z-10"
          aria-hidden="true"
        >
          {TEMPLATE_PREVIEWS.slice(0, 2).map((t, i) => (
            <div
              key={t.slug}
              className={`glass-card rounded-2xl p-4 w-44 will-change-transform ${i === 0 ? "float-card-a" : "float-card-b"}`}
            >
              <div
                className="w-full h-[72px] rounded-xl mb-3"
                style={{
                  background: `linear-gradient(135deg, ${t.primary} 0%, ${t.accent} 100%)`,
                }}
              />
              <p className="text-xs font-semibold text-[--color-charcoal] truncate leading-tight">
                {t.name}
              </p>
              <span className="text-[10px] text-[--color-gold] font-medium">
                {t.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Floating glass card — right */}
        <div
          className="absolute right-[2.5%] top-1/2 -translate-y-1/2 hidden xl:block z-10"
          aria-hidden="true"
        >
          <div className="glass-card rounded-2xl p-4 w-44 will-change-transform float-card-c">
            <div
              className="w-full h-[72px] rounded-xl mb-3"
              style={{
                background: `linear-gradient(135deg, ${TEMPLATE_PREVIEWS[2].primary} 0%, ${TEMPLATE_PREVIEWS[2].accent} 100%)`,
              }}
            />
            <p className="text-xs font-semibold text-[--color-charcoal] truncate leading-tight">
              {TEMPLATE_PREVIEWS[2].name}
            </p>
            <span className="text-[10px] text-[--color-gold] font-medium">
              {TEMPLATE_PREVIEWS[2].tag}
            </span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p
            data-gsap="reveal"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[--color-gold] mb-6"
          >
            Premium Digital Wedding Invitations
          </p>

          {/* Headline — [perspective:1200px] deepens the 3D rotateX stagger.
              hero-title-word applies background-clip gradient fill per span. */}
          <h1
            ref={titleRef}
            className="font-[--font-cormorant] text-[clamp(2.8rem,5.5vw+1rem,5.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] mb-6 [perspective:1200px] [transform-style:preserve-3d]"
            aria-label="Create Your Dream Digital Wedding Invitation"
          >
            {/* Line 1 */}
            {["Create", "Your", "Dream"].map((word, i) => (
              <span
                key={word}
                data-hero-char
                className="inline-block mr-[0.28em] will-change-transform hero-title-word"
                style={{ animationDelay: `${i * -2}s` }}
              >
                {word}
              </span>
            ))}
            <br />
            {/* Line 2 */}
            {["Digital", "Wedding"].map((word, i) => (
              <span
                key={word}
                data-hero-char
                className="inline-block mr-[0.28em] not-italic will-change-transform hero-title-word"
                style={{ animationDelay: `${(i + 3) * -2}s` }}
              >
                {word}
              </span>
            ))}
            <br />
            {/* Line 3 */}
            <span
              data-hero-char
              className="inline-block will-change-transform hero-title-word"
              style={{ animationDelay: "-10s" }}
            >
              Invitation
            </span>
          </h1>

          <p
            data-gsap="reveal"
            className="text-lg md:text-xl text-[--color-charcoal]/55 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            8 stunning templates. WhatsApp delivery. Live RSVP collection.
            <br className="hidden sm:block" />
            All for just ₹399 — one-time, no subscriptions.
          </p>

          <div
            data-gsap="reveal"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/order"
              className="hero-primary-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-medium text-base hover:scale-[1.03] transition-all duration-300 shadow-lg shadow-black/10"
            >
              Create Wedding Invitation
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full border border-[--color-charcoal]/25 text-[--color-charcoal] font-medium text-base hover:border-[--color-charcoal]/60 hover:bg-black/4 transition-all duration-300"
            >
              Browse Templates →
            </Link>
            <Link
              href="/wed-anniversary-wish"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full hero-quiz-btn text-white font-semibold text-base tracking-wide shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              <span className="text-lg leading-none">💝</span>
              Wedding Anniversary
              <span className="inline-flex items-center justify-center bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                Quiz
              </span>
            </Link>
          </div>

          <p
            data-gsap="reveal"
            className="mt-10 text-sm text-[--color-charcoal]/40 flex flex-wrap justify-center gap-x-4 gap-y-1"
          >
            <span>✓ Delivered in 24 hours</span>
            <span>·</span>
            <span>✓ WhatsApp shareable</span>
            <span>·</span>
            <span>✓ 1 year validity</span>
          </p>
        </div>
      </section>
    </>
  );
}
