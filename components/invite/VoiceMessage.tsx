"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";
import type WaveSurfer from "wavesurfer.js";

interface VoiceMessageProps {
  audioUrl?: string;
  templateColor: string;
  quote?: string;
}

// Floating heart particle component
const FloatingHearts = ({
  count = 12,
  color,
}: {
  count: number;
  color: string;
}) => {
  // Generate stable deterministic values using useMemo
  const hearts = useMemo(() => {
    // Deterministic pseudo-random generator
    const deterministicRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => {
      const rand = deterministicRandom(i * 123.456); // different seed per heart
      return {
        id: i,
        left: `${rand * 100}%`,
        delay: rand * 2,
        duration: 2 + rand * 3,
        size: 16 + rand * 24,
      };
    });
  }, [count]); // color not needed for random generation

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
            opacity: [0, 1, 0],
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
          waveColor: `${templateColor}40`,
          progressColor: templateColor,
          cursorColor: templateColor,
          barWidth: 2,
          barRadius: 3,
          height: 80,
          normalize: true,
          backend: "WebAudio",
          barGap: 2,
          cursorWidth: 1,
        });

        wavesurferInstance.load(audioUrl);

        wavesurferInstance.on("ready", () => {
          const dur = wavesurferInstance!.getDuration();
          setDuration(formatTime(dur));
          setDurationSeconds(dur);
        });

        wavesurferInstance.on("audioprocess", () => {
          const time = wavesurferInstance!.getCurrentTime();
          setCurrentTime(formatTime(time));
          setCurrentSeconds(time);
        });

        wavesurferInstance.on("play", () => setIsPlaying(true));
        wavesurferInstance.on("pause", () => setIsPlaying(false));
        wavesurferInstance.on("finish", () => setIsPlaying(false));

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
  }, [audioUrl, templateColor]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  // Calculate progress percentage safely
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

      <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Floating hearts when playing */}
        <AnimatePresence>
          {isPlaying && <FloatingHearts count={12} color={templateColor} />}
        </AnimatePresence>

        {/* Waveform */}
        <div ref={waveformRef} className="mb-4" />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-opacity-30"
            style={{ backgroundColor: templateColor, color: "white" }}
            aria-label={
              isPlaying ? "Pause voice message" : "Play voice message"
            }
          >
            {isPlaying ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{currentTime}</span> /{" "}
            <span className="font-medium">{duration}</span>
          </div>
        </div>

        {/* Optional progress bar (alternative) */}
        <div className="mt-6">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: templateColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      {quote && (
        <p className="text-center mt-6 text-lg italic text-gray-700">
          “{quote}”
        </p>
      )}
    </section>
  );
};
