"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CURATED_TRACKS, TRACK_MOOD_COLORS } from "@/lib/anniversary-music";
import { cn } from "@/lib/utils";
import AudioUploadDropzone from "./AudioUploadDropzone";
import { getSyntheticAudio, preGenerateAll } from "@/lib/synthetic-audio";

interface MusicTrackPickerProps {
  value: string | null;
  onChange: (trackId: string | null) => void;
  /** Custom uploaded audio asset */
  customAudio?: { url: string; name: string } | null;
  onCustomAudioChange?: (file: File | null) => void;
}

export default function MusicTrackPicker({
  value,
  onChange,
  customAudio,
  onCustomAudioChange,
}: MusicTrackPickerProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [synthUrls, setSynthUrls] = useState<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlsReadyRef = useRef(false);

  // Pre-generate synthetic audio on mount
  useEffect(() => {
    if (urlsReadyRef.current) return;
    urlsReadyRef.current = true;

    preGenerateAll(CURATED_TRACKS).then(() => {
      const map = new Map<string, string>();
      CURATED_TRACKS.forEach((t) => {
        getSyntheticAudio(t.id, t.mood).then((url) => {
          map.set(t.id, url);
          setSynthUrls(new Map(map));
        });
      });
    });
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const handlePlay = useCallback(
    (trackId: string) => {
      if (playingId === trackId) {
        stopPlayback();
        return;
      }

      const track = CURATED_TRACKS.find((t) => t.id === trackId);
      if (!track) return;

      stopPlayback();

      // Use synthetic audio blob URL if available, otherwise fall back to file path
      const srcUrl = synthUrls.get(trackId) ?? track.src;
      const audio = new Audio(srcUrl);
      audio.volume = 0.5;
      audio.loop = false;

      audio.addEventListener("ended", () => {
        setPlayingId(null);
        audioRef.current = null;
      });

      audio.addEventListener("error", () => {
        setPlayingId(null);
        audioRef.current = null;
      });

      audio.play().catch(() => {
        // Autoplay may be blocked; visually we just clear the state
        setPlayingId(null);
      });

      audioRef.current = audio;
      setPlayingId(trackId);
    },
    [playingId, stopPlayback, synthUrls],
  );

  const handleSelect = (trackId: string) => {
    if (value === trackId) {
      onChange(null);
      stopPlayback();
    } else {
      onChange(trackId);
      handlePlay(trackId);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold anniversary-gradient-text">
          Background Music{" "}
          <span className="text-xs text-gray-400 font-normal">(optional)</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Pick a song or upload your own — it will play when your partner opens
          the quiz
        </p>
      </div>

      {/* Curated tracks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CURATED_TRACKS.map((track) => {
          const isSelected = value === track.id;
          const isPlaying = playingId === track.id;
          const moodColor = TRACK_MOOD_COLORS[track.mood] ?? "#c9a962";

          return (
            <motion.button
              key={track.id}
              type="button"
              onClick={() => handleSelect(track.id)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "music-track-card flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                isSelected
                  ? "selected border-transparent"
                  : "border-gray-100 bg-white/80 hover:border-gray-200",
              )}
              style={
                {
                  "--track-color": moodColor,
                  "--track-color2": "#e8638c",
                } as React.CSSProperties
              }
            >
              {/* Play/Stop button */}
              <div
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                style={{ backgroundColor: moodColor }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(track.id);
                }}
              >
                {isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    <motion.div
                      animate={{ height: ["40%", "100%", "60%", "80%", "40%"] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-0.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ height: ["80%", "40%", "100%", "60%", "80%"] }}
                      transition={{ repeat: Infinity, duration: 0.9 }}
                      className="w-0.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{ height: ["60%", "80%", "40%", "100%", "60%"] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                      className="w-0.5 bg-white rounded-full"
                    />
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    className="w-4 h-4 text-white ml-0.5"
                  >
                    <path d="M3 1.5a.5.5 0 01.75-.433l7.5 4.5a.5.5 0 010 .866l-7.5 4.5A.5.5 0 013 10.5v-9z" />
                  </svg>
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[--color-charcoal]">
                  {track.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {track.duration}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${moodColor}18`,
                      color: moodColor,
                    }}
                  >
                    {track.mood}
                  </span>
                </div>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="shrink-0 w-5 h-5 rounded-full bg-[--color-gold] flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className="w-3 h-3 text-white"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[--color-gold]/20" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs font-semibold anniversary-gradient-text bg-[--color-cream]">
            OR
          </span>
        </div>
      </div>

      {/* Custom audio upload */}
      <AudioUploadDropzone
        value={customAudio ?? null}
        onChange={(file) => {
          onCustomAudioChange?.(file);
          if (file) {
            // Clear predefined track selection when custom is uploaded
            onChange(null);
          }
        }}
        label="Upload your own music"
        hint="Supports MP3, WAV, M4A — becomes your quiz background music"
      />
    </div>
  );
}
