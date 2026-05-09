"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/hooks/useOrderStore";
import type { MediaAsset } from "@/types/order.types";
import SlideSlideWrapper from "./SlideSlideWrapper";

interface SlidePhotoUploadProps {
  photoIndex: number; // 0-based index within photos array
  totalPhotos: number; // total expected (e.g., 5)
  label: string;
  sublabel?: string;
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export default function SlidePhotoUpload({
  photoIndex,
  totalPhotos,
  label,
  sublabel,
  onNext,
  onBack,
  showBack = false,
}: SlidePhotoUploadProps) {
  const photos = useOrderStore((s) => s.media.photos);
  const updateMedia = useOrderStore((s) => s.updateMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhoto = photos[photoIndex] || null;
  const hasPhoto = !!currentPhoto;
  const hasPreviousPhotos = photoIndex > 0;

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Max file size is 8MB");
      return;
    }

    setIsUploading(true);
    try {
      // For now, create a local object URL and store it
      // In production, this would use useMediaUpload to upload to Supabase
      const url = URL.createObjectURL(file);
      const asset: MediaAsset = {
        name: file.name,
        url,
        path: file.name,
        mimeType: file.type,
        size: file.size,
      };

      const newPhotos = [...photos];
      // Fill in gaps if needed
      while (newPhotos.length <= photoIndex) {
        newPhotos.push({} as MediaAsset);
      }
      newPhotos[photoIndex] = asset;
      updateMedia({ photos: newPhotos.filter(Boolean) });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    const newPhotos = photos.filter((_, i) => i !== photoIndex);
    updateMedia({ photos: newPhotos });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <SlideSlideWrapper
      emoji="📸"
      heading={label}
      subheading={sublabel || `Photo ${photoIndex + 1} of ${totalPhotos}`}
      onContinue={onNext}
      onBack={onBack}
      showBack={showBack}
      continueDisabled={false}
    >
      <div className="w-full space-y-4">
        {/* Previous photos strip */}
        {hasPreviousPhotos && (
          <div className="flex gap-2 justify-center flex-wrap">
            {photos.slice(0, photoIndex).map((photo, i) =>
              photo?.url ? (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg overflow-hidden border border-white/10"
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null,
            )}
            <span className="text-[var(--wiz-text-muted)] text-xs self-center">
              →
            </span>
          </div>
        )}

        {/* Upload dropzone */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            relative w-full h-[200px] rounded-2xl flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-300
            ${
              dragOver
                ? "border-[var(--wiz-accent-gold)] bg-[var(--wiz-input-focus)]"
                : "border-dashed border-white/20 bg-white/5 hover:bg-white/10"
            }
            border-2
          `}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-[var(--wiz-accent-gold)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[var(--wiz-text-secondary)]">
                Uploading...
              </span>
            </div>
          ) : currentPhoto?.url ? (
            <div className="relative w-full h-full">
              <img
                src={currentPhoto.url}
                alt="Uploaded photo"
                className="w-full h-full object-cover rounded-2xl"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                aria-label="Remove photo"
              >
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="text-3xl">📷</span>
              <span className="text-sm text-[var(--wiz-text-secondary)]">
                Tap to upload or drag & drop
              </span>
              <span className="text-xs text-[var(--wiz-text-muted)]">
                Max: 8MB each
              </span>
            </>
          )}
        </motion.div>

        {/* Photo counter */}
        <p className="text-xs text-[var(--wiz-text-muted)] text-center">
          {photos.filter(Boolean).length} photo
          {photos.filter(Boolean).length !== 1 ? "s" : ""} uploaded
        </p>
      </div>
    </SlideSlideWrapper>
  );
}
