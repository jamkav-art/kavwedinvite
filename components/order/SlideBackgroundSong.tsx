"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import type { MediaAsset } from "@/types/order.types";
import SlideSlideWrapper from "./SlideSlideWrapper";

const MAX_SONG_SIZE = 15 * 1024 * 1024; // 15MB

export default function SlideBackgroundSong() {
  const song = useOrderStore((s) => s.media.song);
  const updateMedia = useOrderStore((s) => s.updateMedia);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSong = !!song?.url;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("audio/")) {
      alert("Please upload an audio file (.mp3, .wav, .m4a)");
      return;
    }
    if (file.size > MAX_SONG_SIZE) {
      alert("Max file size is 15MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      const asset: MediaAsset = {
        name: file.name,
        url,
        path: file.name,
        mimeType: file.type,
        size: file.size,
      };
      updateMedia({ song: asset });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current && song?.url) {
      audioRef.current = new Audio(song.url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRemove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    updateMedia({ song: null });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // This is slide 16 - the last data entry slide. The CTA says "Preview Invite"
  const goToCarousel = () => {
    // Go to step 17 (the carousel)
    const store = useOrderStore.getState();
    store.nextStep();
  };

  return (
    <SlideSlideWrapper
      emoji="🎵"
      heading="Background music"
      subheading="Choose a romantic song for your invite"
      onContinue={goToCarousel}
      continueLabel="✨ Preview Invite →"
      onBack={prevStep}
      showBack
    >
      <div className="w-full space-y-4">
        {/* Upload zone */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            relative w-full h-[140px] rounded-2xl flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all duration-300 border-2
            ${
              dragOver
                ? "border-[var(--wiz-accent-gold)] bg-[var(--wiz-input-focus)]"
                : hasSong
                  ? "border-[var(--wiz-accent-gold)]/50 bg-white/5"
                  : "border-dashed border-white/20 bg-white/5 hover:bg-white/10"
            }
          `}
          onClick={() => !hasSong && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-[var(--wiz-accent-gold)] border-t-transparent rounded-full animate-spin" />
          ) : hasSong ? (
            <div className="flex items-center gap-3 px-4">
              <span className="text-2xl">🎵</span>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-[var(--wiz-text-primary)] truncate">
                  {song?.name}
                </p>
                <p className="text-xs text-[var(--wiz-text-muted)]">
                  {song?.size
                    ? `${(song.size / 1024 / 1024).toFixed(1)}MB`
                    : ""}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="w-10 h-10 rounded-full bg-[var(--wiz-accent-gold)]/20 flex items-center justify-center hover:bg-[var(--wiz-accent-gold)]/30 transition-colors"
              >
                {isPlaying ? (
                  <svg
                    className="w-4 h-4 text-[var(--wiz-accent-gold)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-[var(--wiz-accent-gold)]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="text-[var(--wiz-text-muted)] hover:text-[var(--wiz-accent-rose)] transition-colors"
                aria-label="Remove song"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <span className="text-3xl">🎵</span>
              <span className="text-sm text-[var(--wiz-text-secondary)]">
                Tap to upload or drag & drop
              </span>
              <span className="text-xs text-[var(--wiz-text-muted)]">
                .mp3 / .wav / .m4a — Max: 15MB
              </span>
            </>
          )}
        </motion.div>
      </div>
    </SlideSlideWrapper>
  );
}
