"use client";

import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhotoUploadDropzoneProps {
  value: { url: string; name: string } | null;
  onChange: (file: File | null) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export default function PhotoUploadDropzone({
  value,
  onChange,
  label = "Upload photo",
  hint = "Drag & drop or click to upload",
  className,
}: PhotoUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value?.url ?? null);

  // Draw image onto canvas when preview changes
  useEffect(() => {
    if (!preview || !canvasRef.current) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = preview;
  }, [preview]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
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
          "min-h-[160px] p-6",
          dragOver
            ? "border-[--color-magenta] bg-[--color-blush] scale-[1.02]"
            : preview
              ? "border-transparent"
              : "border-gray-200 bg-white/50 hover:border-[--color-gold]/50 hover:bg-[--color-blush]/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInput}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full min-h-[140px] flex items-center justify-center"
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Remove photo"
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
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[--color-blush] flex items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 text-[--color-gold]"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium anniversary-gradient-text">
                  {label}
                </p>
                <p className="text-xs anniversary-gradient-text mt-0.5">
                  {hint}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
