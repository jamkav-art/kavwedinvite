"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioUploadDropzoneProps {
  value: { url: string; name: string } | null;
  onChange: (file: File | null) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export default function AudioUploadDropzone({
  value,
  onChange,
  label = "Upload your own music",
  hint = "Supports MP3, WAV, M4A",
  className,
}: AudioUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value?.url ?? null,
  );
  const [fileName, setFileName] = useState<string | null>(value?.name ?? null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(file.name);
    onChange(file);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const handleRemove = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    if (previewUrl && !value?.url) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewUrl) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        const audio = new Audio(previewUrl);
        audio.addEventListener("ended", () => {
          setIsPlaying(false);
          audioRef.current = null;
        });
        audioRef.current = audio;
      }
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="text-sm font-semibold anniversary-gradient-text">
          {label}
        </p>
      )}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          "min-h-[100px] p-4",
          dragOver
            ? "border-[--color-gold] bg-[--color-blush] scale-[1.02]"
            : previewUrl
              ? "border-transparent bg-gradient-to-br from-[--color-blush]/20 to-[--color-gold]/10"
              : "border-gray-200 bg-white/50 hover:border-[--color-gold]/50 hover:bg-[--color-blush]/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleInput}
        />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 w-full"
            >
              {/* Play/pause button */}
              <button
                type="button"
                onClick={togglePlay}
                className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[--color-gold] to-[--color-magenta] flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-4">
                    <motion.div
                      animate={{
                        height: ["40%", "100%", "60%", "80%", "40%"],
                      }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-0.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{
                        height: ["80%", "40%", "100%", "60%", "80%"],
                      }}
                      transition={{ repeat: Infinity, duration: 0.9 }}
                      className="w-0.5 bg-white rounded-full"
                    />
                    <motion.div
                      animate={{
                        height: ["60%", "80%", "40%", "100%", "60%"],
                      }}
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
              </button>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[--color-charcoal] truncate">
                  {fileName || "Audio file"}
                </p>
                <p className="text-xs text-gray-400">Click play to preview</p>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="shrink-0 w-7 h-7 rounded-full bg-black/10 text-gray-400 flex items-center justify-center hover:bg-black/20 hover:text-[--color-charcoal] transition-colors"
                aria-label="Remove audio"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[--color-blush] to-[--color-gold]/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-[--color-gold]"
                >
                  <path d="M10 1a1 1 0 011 1v6.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 8.586V2a1 1 0 011-1z" />
                  <path d="M2 13a1 1 0 011 1v1a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 112 0v1a4 4 0 01-4 4H6a4 4 0 01-4-4v-1a1 1 0 011-1z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[--color-charcoal]">
                  {label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
