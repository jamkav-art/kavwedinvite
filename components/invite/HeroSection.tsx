"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TemplateConfig } from "@/types/template.types";
import { FloralCorner } from "@/components/order/FloralBorders";

interface HeroSectionProps {
  couple: {
    name1: string;
    name2: string;
  };
  weddingDate: string;
  template: TemplateConfig;
}

// Particle system based on particleType
const ParticleBackground = ({
  particleType,
  colors,
}: {
  particleType?: string;
  colors: TemplateConfig["colors"];
}) => {
  if (!particleType) return null;

  // Simple placeholder for now - will be replaced with actual particle systems
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particleType === "sparkles" && (
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                opacity: 0.3 + (i % 10) * 0.05,
                animationDelay: `${(i * 0.2) % 4}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}
      {particleType === "leaves" && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 11) % 100}%`,
                top: `${(i * 17) % 100}%`,
                width: "20px",
                height: "20px",
                opacity: 0.2,
                transform: `rotate(${(i * 36) % 360}deg)`,
                animation: `float ${8 + (i % 5)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.5) % 4}s`,
              }}
            >
              <svg viewBox="0 0 24 24" fill={colors.accent}>
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" />
              </svg>
            </div>
          ))}
        </div>
      )}
      {particleType === "bokeh" && (
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-md"
              style={{
                left: `${(i * 23) % 100}%`,
                top: `${(i * 29) % 100}%`,
                width: `${40 + (i % 5) * 10}px`,
                height: `${40 + (i % 5) * 10}px`,
                background: `radial-gradient(circle, ${colors.primary}30, transparent 70%)`,
                opacity: 0.1 + (i % 5) * 0.02,
                animation: `pulse ${10 + (i % 10)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.7) % 6}s`,
              }}
            />
          ))}
        </div>
      )}
      {particleType === "stars" && (
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 7) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                backgroundColor: colors.secondary,
                opacity: 0.5 + (i % 10) * 0.05,
                animation: `twinkle ${1 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.1) % 2}s`,
              }}
            />
          ))}
        </div>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `,
        }}
      />
    </div>
  );
};

// Border frame using template's SVG
const BorderFrame = ({
  svgPath,
  color,
}: {
  svgPath?: string;
  color: string;
}) => {
  if (!svgPath) {
    // Fallback to floral corners
    return (
      <>
        <FloralCorner color={color} position="top-left" size={80} />
        <FloralCorner color={color} position="top-right" size={80} />
        <FloralCorner color={color} position="bottom-left" size={80} />
        <FloralCorner color={color} position="bottom-right" size={80} />
      </>
    );
  }

  // Use img tag for SVG (could be replaced with inline SVG loading)
  return (
    <>
      <div className="absolute top-0 left-0 w-20 h-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(0deg)" }}
        />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(90deg)" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20">
        <img
          src={svgPath}
          alt=""
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20">
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

export const HeroSection = ({
  couple,
  weddingDate,
  template,
}: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!namesRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    // Animate each letter (simple version without SplitText plugin)
    const text = namesRef.current;
    const letters = text.textContent?.split("") || [];
    text.innerHTML = letters
      .map(
        (letter) =>
          `<span style="display: inline-block; opacity: 0;">${letter === " " ? "&nbsp;" : letter}</span>`,
      )
      .join("");

    const spans = text.querySelectorAll("span");

    tl.to(spans, {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.5,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${template.colors.background} 0%, ${template.colors.primary}20 100%)`,
      }}
    >
      {/* Background Particles */}
      <ParticleBackground
        particleType={template.animations?.particleType}
        colors={template.colors}
      />

      {/* Decorative border frame */}
      <BorderFrame
        svgPath={template.borders.svgPath}
        color={template.colors.border}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Couple Names with clamp typography */}
        <h1
          ref={namesRef}
          className="mb-4"
          style={{
            fontFamily: template.fonts.heading,
            color: template.colors.text,
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            lineHeight: 1.2,
          }}
        >
          {couple.name1} & {couple.name2}
        </h1>

        {/* Subtitle */}
        <p
          className="mb-2"
          style={{
            fontFamily: template.fonts.body,
            color: template.colors.text,
            opacity: 0.8,
            fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
          }}
        >
          are getting married!
        </p>

        {/* Date */}
        <p
          style={{
            fontFamily: template.fonts.accent,
            color: template.colors.primary,
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          }}
        >
          {new Date(weddingDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <svg
          width="24"
          height="24"
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
};
