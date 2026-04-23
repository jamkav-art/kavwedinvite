"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Media } from "@/types/database.types";

type GlobalMusicPlayerProps = {
  song: Media | null;
  accentColor?: string;
  /** When true, the audio will begin playback (triggered by Gatekeeper) */
  play?: boolean;
};

export default function GlobalMusicPlayer({
  song,
  accentColor,
  play,
}: GlobalMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Prepare audio element
  useEffect(() => {
    if (!song) return;
    setIsReady(true);
  }, [song]);

  // Start playing when Gatekeeper signals
  useEffect(() => {
    if (!play || !audioRef.current || !song) return;

    audioRef.current.volume = 0.5;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setShowButton(true);
      })
      .catch((e) => {
        console.warn("GlobalMusicPlayer: playback prevented:", e);
      });
  }, [play, song]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => console.warn(e));
    }
  };

  if (!isReady || !song) return null;

  return (
    <>
      <audio ref={audioRef} src={song.file_url} loop preload="none" />

      {/* Floating mute/unmute button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm border border-black/5 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-4">
                <motion.div
                  animate={{ height: ["40%", "100%", "60%", "80%", "40%"] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1 bg-black/70 rounded-full"
                />
                <motion.div
                  animate={{ height: ["80%", "40%", "100%", "60%", "80%"] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="w-1 bg-black/70 rounded-full"
                />
                <motion.div
                  animate={{ height: ["60%", "80%", "40%", "100%", "60%"] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="w-1 bg-black/70 rounded-full"
                />
                <motion.div
                  animate={{ height: ["100%", "60%", "80%", "40%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.0 }}
                  className="w-1 bg-black/70 rounded-full"
                />
              </div>
            ) : (
              <svg
                className="w-5 h-5 text-black/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
