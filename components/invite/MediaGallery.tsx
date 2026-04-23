"use client";

import Image from "next/image";
import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Masonry from "react-masonry-css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import type { Media } from "@/types/database.types";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type MediaGalleryProps = {
  photos: Media[];
  videos: Media[];
  voice: Media | null;
  accentColor?: string;
  className?: string;
};

const breakpointColumns = {
  default: 3,
  768: 2,
  480: 2,
};

export default function MediaGallery({
  photos,
  videos,
  voice,
  accentColor,
  className,
}: MediaGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<Media | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  const orderedPhotos = useMemo(
    () => [...photos].sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1)),
    [photos],
  );

  const orderedVideos = useMemo(
    () => [...videos].sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1)),
    [videos],
  );

  // GSAP ScrollTrigger parallax for masonry columns
  useEffect(() => {
    if (!galleryRef.current || orderedPhotos.length === 0) return;

    const columns =
      galleryRef.current.querySelectorAll<HTMLElement>(".masonry-column");
    if (!columns.length) return;

    const triggers: ScrollTrigger[] = [];

    columns.forEach((col, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const tween = gsap.fromTo(
        col,
        { y: 0 },
        {
          y: direction * 40,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        },
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [orderedPhotos]);

  // Masonry styles
  const masonryStyles = `
    .masonry-grid {
      display: flex;
      margin-left: -12px;
      width: auto;
    }
    .masonry-column {
      padding-left: 12px;
      background-clip: padding-box;
    }
    .masonry-column > div {
      margin-bottom: 12px;
    }
  `;

  return (
    <div ref={galleryRef} className={cn("space-y-6", className)}>
      <style>{masonryStyles}</style>

      {/* Voice note section */}
      {voice ? (
        <div
          className="rounded-2xl border border-black/10 bg-white/70 p-4 sm:p-5"
          style={{ borderColor: `${accentColor ?? "var(--invite-border)"}55` }}
        >
          <p className="text-[11px] tracking-[0.18em] uppercase text-black/45">
            Voice note
          </p>
          <p className="mt-1 text-sm text-black/65">
            A message from the couple
          </p>
          <div className="mt-3">
            <audio controls className="w-full">
              <source src={voice.file_url} />
            </audio>
          </div>
        </div>
      ) : null}

      {/* Videos */}
      {orderedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orderedVideos.map((v) => (
            <div
              key={v.id}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white/70"
              style={{
                borderColor: `${accentColor ?? "var(--invite-border)"}55`,
              }}
            >
              <video controls playsInline className="w-full h-auto">
                <source src={v.file_url} />
              </video>
            </div>
          ))}
        </div>
      ) : null}

      {/* Masonry Photo Gallery */}
      {orderedPhotos.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-column"
        >
          {orderedPhotos.map((p) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => setActivePhoto(p)}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white block w-full text-left"
              style={{
                borderColor: `${accentColor ?? "var(--invite-border)"}33`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio: p.file_name?.endsWith(".mp4") ? "16/9" : "3/4",
                }}
              >
                <Image
                  src={p.file_url}
                  alt={p.file_name ?? "Photo"}
                  fill
                  sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </motion.button>
          ))}
        </Masonry>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-black/60">
          No media uploaded yet.
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActivePhoto(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Image container */}
            <motion.div
              layoutId={activePhoto.id}
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-3xl bg-black/90 shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={activePhoto.file_url}
                  alt={activePhoto.file_name ?? "Photo"}
                  fill
                  sizes="920px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between px-5 py-4 bg-black/80 text-white/80">
                <span className="text-sm truncate max-w-[70%]">
                  {activePhoto.file_name ?? "Photo"}
                </span>
                <div className="flex items-center gap-3">
                  {/* Nav buttons */}
                  {(() => {
                    const idx = orderedPhotos.findIndex(
                      (ph) => ph.id === activePhoto.id,
                    );
                    const prev = idx > 0 ? orderedPhotos[idx - 1] : null;
                    const next =
                      idx < orderedPhotos.length - 1
                        ? orderedPhotos[idx + 1]
                        : null;
                    return (
                      <>
                        {prev && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhoto(prev);
                            }}
                            className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Previous photo"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                        )}
                        {next && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhoto(next);
                            }}
                            className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Next photo"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        )}
                      </>
                    );
                  })()}
                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    className="rounded-full w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
