"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import type { MediaAsset } from "@/types/order.types";
import SlideSlideWrapper from "./SlideSlideWrapper";

const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30MB

function formatDuration(file: File): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const mins = Math.floor(video.duration / 60);
      const secs = Math.floor(video.duration % 60);
      resolve(
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
      );
    };
    video.onerror = () => resolve("--:--");
    video.src = URL.createObjectURL(file);
  });
}

export default function SlideVideos() {
  const videos = useOrderStore((s) => s.media.videos);
  const updateMedia = useOrderStore((s) => s.updateMedia);
  const nextStep = useOrderStore((s) => s.nextStep);
  const prevStep = useOrderStore((s) => s.prevStep);

  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [durations, setDurations] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const newAssets: MediaAsset[] = [];
    const newDurations: Record<number, string> = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("video/")) continue;
      if (file.size > MAX_VIDEO_SIZE) {
        alert(`"${file.name}" exceeds 30MB limit`);
        continue;
      }

      setIsUploading(true);
      try {
        const url = URL.createObjectURL(file);
        const dur = await formatDuration(file);
        const asset: MediaAsset = {
          name: file.name,
          url,
          path: file.name,
          mimeType: file.type,
          size: file.size,
        };
        newAssets.push(asset);
        newDurations[videos.length + newAssets.length - 1] = dur;
      } finally {
        setIsUploading(false);
      }
    }

    if (newAssets.length > 0) {
      updateMedia({ videos: [...videos, ...newAssets] });
      setDurations((prev) => ({ ...prev, ...newDurations }));
    }
  };

  const handleRemove = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    updateMedia({ videos: newVideos });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  return (
    <SlideSlideWrapper
      emoji="🎥"
      heading="Your wedding videos"
      subheading="Optional — up to 30MB each"
      onContinue={nextStep}
      onBack={prevStep}
      showBack
    >
      <div className="w-full space-y-4">
        {/* Upload dropzone */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            relative w-full h-[160px] rounded-2xl flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all duration-300 border-2
            ${
              dragOver
                ? "border-[var(--wiz-accent-gold)] bg-[var(--wiz-input-focus)]"
                : "border-dashed border-white/20 bg-white/5 hover:bg-white/10"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
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
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {isUploading ? (
            <div className="w-8 h-8 border-2 border-[var(--wiz-accent-gold)] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-3xl">🎬</span>
              <span className="text-sm text-[var(--wiz-text-secondary)]">
                Tap to upload or drag & drop
              </span>
            </>
          )}
        </motion.div>

        {/* Video list */}
        {videos.map((video, i) => (
          <div
            key={i}
            className="flex items-center gap-3 wiz-glass px-4 py-3 rounded-xl"
          >
            <span className="text-xl">▶️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--wiz-text-primary)] truncate">
                {video.name}
              </p>
              <p className="text-xs text-[var(--wiz-text-muted)]">
                {durations[i] || "--:--"}
              </p>
            </div>
            <button
              onClick={() => handleRemove(i)}
              className="text-[var(--wiz-text-muted)] hover:text-[var(--wiz-accent-rose)] transition-colors"
              aria-label={`Remove ${video.name}`}
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
        ))}
      </div>
    </SlideSlideWrapper>
  );
}
