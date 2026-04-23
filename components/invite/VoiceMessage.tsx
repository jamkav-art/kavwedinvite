"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type WaveSurfer from "wavesurfer.js";

interface VoiceMessageProps {
  audioUrl?: string;
  templateColor: string;
  quote?: string;
}

// ---------------------------------------------------------------------------
// Equalizer bars — animated during playback
// ---------------------------------------------------------------------------

function EqualizerBars({
  isPlaying,
  color,
}: {
  isPlaying: boolean;
  color: string;
}) {
  const bars = useMemo(
    () => [
      { id: 1, heights: ["30%", "100%", "50%", "80%", "30%"], dur: 0.7 },
      { id: 2, heights: ["70%", "40%", "100%", "60%", "70%"], dur: 0.9 },
      { id: 3, heights: ["50%", "80%", "30%", "100%", "50%"], dur: 0.6 },
      { id: 4, heights: ["90%", "50%", "70%", "30%", "90%"], dur: 0.8 },
    ],
    [],
  );

  return (
    <div className="flex items-end justify-center gap-[3px] h-8 w-12">
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          className="w-[4px] rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 6px ${color}66`,
          }}
          animate={isPlaying ? { height: bar.heights } : { height: "30%" }}
          transition={{
            repeat: isPlaying ? Infinity : 0,
            duration: bar.dur,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Floating heart particles (dark theme)
// ---------------------------------------------------------------------------

const FloatingHearts = ({
  count = 12,
  color,
}: {
  count: number;
  color: string;
}) => {
  const hearts = useMemo(() => {
    const deterministicRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => {
      const rand = deterministicRandom(i * 123.456);
      return {
        id: i,
        left: `${rand * 100}%`,
        delay: rand * 2,
        duration: 2 + rand * 3,
        size: 16 + rand * 24,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: heart.left,
            bottom: "-10%",
            width: heart.size,
            height: heart.size,
            color,
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main VoiceMessage component
// ---------------------------------------------------------------------------

export const VoiceMessage = ({
  audioUrl,
  templateColor,
  quote,
}: VoiceMessageProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const containerRef = useScrollAnimation("fade");
  const hasFiredConfetti = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Canvas-confetti burst on finish
  const fireConfetti = useCallback(() => {
    if (hasFiredConfetti.current) return;
    hasFiredConfetti.current = true;

    const colors = [templateColor, "#FFD700", "#FF6B6B"];

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors,
      shapes: ["circle", "square"],
      ticks: 100,
      gravity: 1.2,
      scalar: 0.8,
    });

    // Second burst slightly offset
    setTimeout(() => {
      confetti({
        particleCount: 20,
        angle: 60,
        spread: 55,
        origin: { x: 0.3, y: 0.7 },
        colors,
        ticks: 80,
        scalar: 0.6,
      });
      confetti({
        particleCount: 20,
        angle: 120,
        spread: 55,
        origin: { x: 0.7, y: 0.7 },
        colors,
        ticks: 80,
        scalar: 0.6,
      });
    }, 200);
  }, [templateColor]);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    let wavesurferInstance: WaveSurfer | null = null;
    let mounted = true;

    const initWaveSurfer = async () => {
      try {
        const WaveSurfer = (await import("wavesurfer.js")).default;
        if (!mounted) return;

        wavesurferInstance = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: `${templateColor}30`,
          progressColor: templateColor,
          cursorColor: templateColor,
          barWidth: 3,
          barRadius: 4,
          height: 80,
          normalize: true,
          backend: "WebAudio",
          barGap: 3,
          cursorWidth: 0,
        });

        wavesurferInstance.load(audioUrl);

        wavesurferInstance.on("ready", () => {
          const dur = wavesurferInstance!.getDuration();
          setDuration(formatTime(dur));
          setDurationSeconds(dur);
          hasFiredConfetti.current = false;
        });

        wavesurferInstance.on("audioprocess", () => {
          const time = wavesurferInstance!.getCurrentTime();
          setCurrentTime(formatTime(time));
          setCurrentSeconds(time);
        });

        wavesurferInstance.on("play", () => setIsPlaying(true));
        wavesurferInstance.on("pause", () => setIsPlaying(false));
        wavesurferInstance.on("finish", () => {
          setIsPlaying(false);
          fireConfetti();
        });

        wavesurferRef.current = wavesurferInstance;
      } catch (error) {
        console.error("Failed to load wavesurfer.js", error);
      }
    };

    initWaveSurfer();

    return () => {
      mounted = false;
      if (wavesurferInstance) {
        wavesurferInstance.destroy();
      }
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioUrl, templateColor, fireConfetti]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  const progressPercent =
    durationSeconds > 0 ? (currentSeconds / durationSeconds) * 100 : 0;

  if (!audioUrl) return null;

  return (
    <section
      ref={containerRef}
      className="py-16 px-6 max-w-3xl mx-auto relative"
    >
      <h2
        className="text-3xl md:text-4xl text-center mb-8 font-serif"
        style={{ color: templateColor }}
      >
        💌 A Message From Us
      </h2>

      {/* Dark card */}
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border border-white/5">
        {/* Floating hearts when playing */}
        <AnimatePresence>
          {isPlaying && <FloatingHearts count={12} color={templateColor} />}
        </AnimatePresence>

        {/* Waveform — dark theme styling */}
        <div
          ref={waveformRef}
          className="mb-5 [&_wave]:!opacity-80"
          style={{ filter: "brightness(1.2)" }}
        />

        {/* Controls row */}
        <div className="flex items-center justify-between relative z-10">
          {/* Play/Pause button with equalizer */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              style={{ backgroundColor: templateColor, color: "white" }}
              aria-label={
                isPlaying ? "Pause voice message" : "Play voice message"
              }
            >
              {isPlaying ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Equalizer bars */}
            <EqualizerBars isPlaying={isPlaying} color={templateColor} />
          </div>

          {/* Time display */}
          <div className="text-sm text-white/50 font-mono tabular-nums tracking-wide">
            <span className="text-white/80 font-medium">{currentTime}</span>
            <span className="mx-1.5 opacity-40">/</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 relative z-10">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: templateColor }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      {quote && (
        <p
          className="text-center mt-6 text-lg italic leading-relaxed max-w-xl mx-auto"
          style={{ color: templateColor }}
        >
          “{quote}”
        </p>
      )}
    </section>
  );
};
