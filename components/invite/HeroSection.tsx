"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { TemplateConfig } from "@/types/template.types";
import { FloralCorner } from "@/components/order/FloralBorders";
import CountdownTimer from "@/components/invite/CountdownTimer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HeroSectionProps {
  couple: {
    name1: string;
    name2: string;
  };
  weddingDate: string;
  template: TemplateConfig;
  heroPhoto?: string | null;
}

// ---------------------------------------------------------------------------
// Decorative border frame (unchanged from original)
// ---------------------------------------------------------------------------

const BorderFrame = ({
  svgPath,
  color,
}: {
  svgPath?: string;
  color: string;
}) => {
  if (!svgPath) {
    return (
      <>
        <FloralCorner color={color} position="top-left" size={80} />
        <FloralCorner color={color} position="top-right" size={80} />
        <FloralCorner color={color} position="bottom-left" size={80} />
        <FloralCorner color={color} position="bottom-right" size={80} />
      </>
    );
  }

  return (
    <>
      <div className="absolute top-0 left-0 w-20 h-20 z-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(0deg)" }}
        />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 z-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 z-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 z-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Falling particles — GSAP-driven, DOM-based, supports all particleTypes
// ---------------------------------------------------------------------------

function FallingParticles({
  particleType,
  color,
}: {
  particleType?: string;
  color: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build particle configs once
  const configs = useMemo(() => {
    if (!particleType) return [];

    const count =
      particleType === "sparkles"
        ? 30
        : particleType === "leaves"
          ? 18
          : particleType === "bokeh"
            ? 12
            : 24;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 6,
      size:
        particleType === "bokeh"
          ? 20 + Math.random() * 30
          : 6 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 120,
      rotationEnd: Math.random() * 360,
    }));
  }, [particleType]);

  useEffect(() => {
    if (!containerRef.current || !particleType) return;

    const elements =
      containerRef.current.querySelectorAll<HTMLElement>(".particle-el");
    if (!elements.length) return;

    const tl = gsap.timeline({ repeat: -1 });

    elements.forEach((el, i) => {
      const cfg = configs[i];
      if (!cfg) return;

      // Set initial position above viewport
      gsap.set(el, {
        y: -60,
        x: 0,
        opacity: 0,
        rotation: 0,
        scale: 0.6,
      });

      tl.to(
        el,
        {
          y: "120vh",
          x: cfg.drift,
          opacity: 0.6,
          rotation: cfg.rotationEnd,
          scale: 1,
          duration: cfg.duration,
          delay: cfg.delay,
          ease: "power1.inOut",
        },
        0,
      )
        .to(
          el,
          {
            opacity: 0,
            duration: 1.5,
            ease: "power2.out",
          },
          `>-1.5`,
        )
        .set(
          el,
          {
            y: -60,
            x: 0,
            rotation: 0,
            opacity: 0,
            scale: 0.6,
          },
          `>`,
        );
    });

    return () => {
      tl.kill();
    };
  }, [particleType, color, configs]);

  if (!particleType) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
    >
      {configs.map((cfg) => (
        <div
          key={cfg.id}
          className="particle-el absolute will-change-transform"
          style={{
            left: cfg.left,
            width: cfg.size,
            height: cfg.size,
          }}
        >
          {particleType === "leaves" ? (
            <svg
              viewBox="0 0 24 24"
              fill={color}
              className="w-full h-full drop-shadow-lg"
            >
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
            </svg>
          ) : particleType === "bokeh" ? (
            <div
              className="w-full h-full rounded-full blur-xl"
              style={{
                background: `radial-gradient(circle, ${color}60, transparent 70%)`,
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: particleType === "sparkles" ? color : color,
                opacity: 0.5,
                boxShadow: `0 0 ${cfg.size}px ${color}44`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main HeroSection component
// ---------------------------------------------------------------------------

export const HeroSection = ({
  couple,
  weddingDate,
  template,
  heroPhoto,
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const namesContainerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);

  // -----------------------------------------------------------------------
  // GSAP letter-splitting animation (vanilla JS, no SplitText plugin)
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!namesContainerRef.current) return;

    const container = namesContainerRef.current;
    const nameLines = container.querySelectorAll<HTMLElement>(".name-line");
    const ampersand = container.querySelector<HTMLElement>(".ampersand");

    const tl = gsap.timeline({ delay: 0.3 });

    // Split each name line into letter spans
    nameLines.forEach((line) => {
      const text = line.textContent || "";
      line.innerHTML = text
        .split("")
        .map(
          (ch) =>
            `<span class="letter" style="display:inline-block;opacity:0">${ch === " " ? "&nbsp;" : ch}</span>`,
        )
        .join("");
    });

    const firstLine = nameLines[0];
    const secondLine = nameLines[1];
    const firstLetters = firstLine?.querySelectorAll(".letter") || [];
    const secondLetters = secondLine?.querySelectorAll(".letter") || [];

    // Timeline:
    // 1. First name letters stagger in
    // 2. "&" fades in
    // 3. Second name letters stagger in
    // 4. Subtitle fades up
    // 5. Date fades up

    if (firstLetters.length) {
      tl.fromTo(
        firstLetters,
        { opacity: 0, y: 30, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: "power2.out",
        },
      );
    }

    if (ampersand) {
      tl.fromTo(
        ampersand,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.1",
      );
    }

    if (secondLetters.length) {
      tl.fromTo(
        secondLetters,
        { opacity: 0, y: 30, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.04,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.05",
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      );
    }

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

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const hasPhoto = Boolean(heroPhoto);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ---- Background ---- */}
      {hasPhoto ? (
        <>
          <Image
            src={heroPhoto!}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70 z-[1]" />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${template.colors.background} 0%, ${template.colors.primary}20 100%)`,
          }}
        />
      )}

      {/* ---- Falling particles ---- */}
      <FallingParticles
        particleType={template.animations?.particleType}
        color={template.colors.primary}
      />

      {/* ---- Border frame ---- */}
      <BorderFrame
        svgPath={template.borders.svgPath}
        color={template.colors.border}
      />

      {/* ---- Center content ---- */}
      <div className="relative z-10 text-center px-6 max-w-4xl w-full flex flex-col items-center justify-center min-h-[70vh]">
        {/* Couple Names — letter-split friendly structure */}
        <div ref={namesContainerRef} className="mb-4">
          <h1
            style={{
              fontFamily: template.fonts.heading,
              color: hasPhoto ? "#ffffff" : template.colors.text,
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              lineHeight: 1.15,
            }}
            className="flex flex-col items-center gap-1 sm:gap-2"
          >
            <span className="name-line">{couple.name1}</span>
            <span
              className="ampersand"
              style={{
                fontFamily: template.fonts.accent,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                opacity: 0,
                display: "inline-block",
                color: hasPhoto ? "#ffffffcc" : template.colors.primary,
              }}
            >
              &bull;
            </span>
            <span className="name-line">{couple.name2}</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-2 tracking-wide"
          style={{
            fontFamily: template.fonts.body,
            color: hasPhoto ? "#ffffffcc" : template.colors.text,
            fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
            opacity: 0,
          }}
        >
          are getting married!
        </p>

        {/* Date */}
        <p
          ref={dateRef}
          style={{
            fontFamily: template.fonts.accent,
            color: hasPhoto ? "#ffffff" : template.colors.primary,
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            opacity: 0,
          }}
        >
          {new Date(weddingDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ---- Countdown integrated at bottom with glassmorphism ---- */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10">
        <div
          className="backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
          style={{
            background: hasPhoto
              ? "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.7)",
            boxShadow: hasPhoto ? "0 8px 32px rgba(0,0,0,0.2)" : undefined,
          }}
        >
          <CountdownTimer
            weddingDate={weddingDate}
            accentColor={hasPhoto ? "#ffffff" : template.colors.primary}
            className="!border-0 !bg-transparent"
          />
        </div>
      </div>

      {/* ---- Scroll indicator ---- */}
      <div className="absolute bottom-8 z-10 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hasPhoto ? "#ffffff" : template.colors.primary}
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};
