"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateConfig } from "@/types/template.types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GatekeeperProps {
  coupleName1: string;
  coupleName2: string;
  template: TemplateConfig;
  /** Called once the fade-out animation completes */
  onUnlock: () => void;
  /** The invite content to reveal */
  children: React.ReactNode;
}

type GatekeeperPhase = "locked" | "unlocking" | "fading-out" | "revealed";

// ---------------------------------------------------------------------------
// Monogram — interwoven initials SVG
// ---------------------------------------------------------------------------

function MonogramInitial({
  letter,
  color,
  index,
}: {
  letter: string;
  color: string;
  index: number;
}) {
  return (
    <motion.span
      className="inline-block font-serif font-bold leading-none select-none"
      style={{
        color,
        fontSize: "clamp(4rem, 15vw, 10rem)",
        fontVariationSettings: `"wght" 700`,
        textShadow: `0 0 40px ${color}33, 0 0 80px ${color}22`,
      }}
      initial={{ opacity: 0, y: 40, rotateZ: index === 0 ? -8 : 8 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.34, 1.56, 0.64, 1], // easeOutBack
      }}
    >
      {letter}
    </motion.span>
  );
}

function Ampersand({ color }: { color: string }) {
  return (
    <motion.span
      className="inline-block mx-2 select-none"
      style={{
        color,
        fontSize: "clamp(2rem, 8vw, 5rem)",
        fontFamily: "serif",
        opacity: 0.6,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.6, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
    >
      &
    </motion.span>
  );
}

function Monogram({
  name1,
  name2,
  color,
}: {
  name1: string;
  name2: string;
  color: string;
}) {
  const initial1 = name1.charAt(0).toUpperCase();
  const initial2 = name2.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-center">
      <MonogramInitial letter={initial1} color={color} index={0} />
      <Ampersand color={color} />
      <MonogramInitial letter={initial2} color={color} index={1} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pulsing CTA ring
// ---------------------------------------------------------------------------

function TapToOpenButton({
  onClick,
  color,
  phase,
}: {
  onClick: () => void;
  color: string;
  phase: GatekeeperPhase;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={phase !== "locked"}
      className="relative flex items-center justify-center w-24 h-24 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      style={{ outlineColor: color }}
      whileTap={phase === "locked" ? { scale: 0.95 } : undefined}
      animate={
        phase === "locked"
          ? {
              scale: [1, 1.06, 1],
              transition: {
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              },
            }
          : { scale: 1 }
      }
    >
      {/* Outer glow ring */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${color}55`,
          boxShadow: `0 0 30px ${color}44, 0 0 60px ${color}22`,
        }}
        animate={
          phase === "locked"
            ? {
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6],
                transition: {
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                },
              }
            : { scale: 1, opacity: 1 }
        }
      />

      {/* Play icon */}
      <span className="relative z-10 text-white ml-1">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      {/* Glassmorphism inner circle */}
      <span
        className="absolute inset-2 rounded-full backdrop-blur-sm"
        style={{ background: `${color}22` }}
      />
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Background particles (subtle floating orbs)
// ---------------------------------------------------------------------------

function GatekeeperParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: `${(i * 8.3) % 100}%`,
    y: `${(i * 13.7) % 100}%`,
    size: 4 + (i % 4) * 3,
    delay: (i * 0.4) % 3,
    duration: 5 + (i % 5) * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Gatekeeper component
// ---------------------------------------------------------------------------

export function Gatekeeper({
  coupleName1,
  coupleName2,
  template,
  onUnlock,
  children,
}: GatekeeperProps) {
  const [phase, setPhase] = useState<GatekeeperPhase>("locked");
  const audioContextRef = useRef<AudioContext | null>(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleTap = useCallback(async () => {
    if (phase !== "locked") return;
    setPhase("unlocking");

    try {
      // 1. Initialize & resume Web Audio API (unlocks audio playback for browser)
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (!mountedRef.current) return;

      // 2. Begin fade-out transition
      setPhase("fading-out");
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!mountedRef.current) return;
      setPhase("revealed");
      onUnlock();
    } catch (err) {
      console.warn("Gatekeeper: unlock failed, proceeding anyway", err);
      if (!mountedRef.current) return;
      setPhase("fading-out");
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!mountedRef.current) return;
      setPhase("revealed");
      onUnlock();
    }
  }, [phase, onUnlock]);

  const isRevealed = phase === "revealed";

  return (
    <>
      {/* Gatekeeper overlay — visible until revealed */}
      <AnimatePresence mode="wait">
        {!isRevealed && (
          <motion.div
            key="gatekeeper"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, ${template.colors.primary}18 0%, ${template.colors.background} 70%)`,
              backgroundColor: template.colors.background,
            }}
            exit={{
              opacity: 0,
              scale: 1.05,
              filter: "blur(8px)",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Subtle particles */}
            <GatekeeperParticles color={template.colors.primary} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-10 px-6 text-center">
              {/* Monogram */}
              <Monogram
                name1={coupleName1}
                name2={coupleName2}
                color={template.colors.primary}
              />

              {/* Tagline */}
              <motion.p
                className="text-sm tracking-[0.3em] uppercase font-medium"
                style={{ color: template.colors.text, opacity: 0.5 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Wedding Invitation
              </motion.p>

              {/* Tap to Open Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <TapToOpenButton
                  onClick={handleTap}
                  color={template.colors.primary}
                  phase={phase}
                />
              </motion.div>

              {/* Loading / status text */}
              {phase !== "locked" && (
                <motion.p
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{ color: template.colors.primary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {phase === "unlocking" && "Initializing..."}
                  {phase === "fading-out" && "Entering..."}
                </motion.p>
              )}
            </div>

            {/* Bottom branding */}
            <motion.p
              className="absolute bottom-10 text-[10px] tracking-[0.35em] uppercase select-none"
              style={{ color: template.colors.text, opacity: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              WedInviter
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Children (invite content) — always mounted, hidden by gatekeeper until revealed */}
      <div
        style={{
          opacity: isRevealed ? 1 : 0,
          pointerEvents: isRevealed ? "auto" : "none",
          transition: "opacity 0.6s ease 0.1s",
        }}
      >
        {children}
      </div>
    </>
  );
}
