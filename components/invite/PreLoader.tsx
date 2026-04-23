"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreLoaderProps {
  templateColor: string;
  onComplete: () => void;
}

export const PreLoader = ({ templateColor, onComplete }: PreLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mandalaRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Background fade in
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
    );

    // Mandala rotate + scale in (start 0.1s before previous ends)
    tl.fromTo(
      mandalaRef.current,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.1",
    );

    // Text fade up (start 0.2s before mandala ends)
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2",
    );

    // Pulse animation (single dip and return)
    tl.to(textRef.current, {
      opacity: 0.5,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    });

    // Fade out everything
    tl.to(containerRef.current, { opacity: 0, duration: 0.3 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${templateColor}15 0%, ${templateColor}30 100%)`,
      }}
    >
      {/* Mandala SVG */}
      <div ref={mandalaRef} className="mb-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={templateColor}
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke={templateColor}
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke={templateColor}
            strokeWidth="1"
            fill={`${templateColor}30`}
          />
        </svg>
      </div>

      {/* Loading text */}
      <p
        ref={textRef}
        className="text-lg font-serif tracking-wider"
        style={{ color: templateColor }}
      >
        Loading your invite...
      </p>
    </div>
  );
};
