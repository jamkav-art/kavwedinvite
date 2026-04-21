'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Media } from '@/types/database.types'
import { cn } from '@/lib/utils'

type MediaGalleryProps = {
  photos: Media[]
  videos: Media[]
  voice: Media | null
  accentColor?: string
  className?: string
}

export default function MediaGallery({
  photos,
  videos,
  voice,
  accentColor,
  className,
}: MediaGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<Media | null>(null)
  const [musicEnabled, setMusicEnabled] = useState(false)

  const orderedPhotos = useMemo(
    () => [...photos].sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1)),
    [photos]
  )

  const orderedVideos = useMemo(
    () => [...videos].sort((a, b) => (a.uploaded_at < b.uploaded_at ? -1 : 1)),
    [videos]
  )

  return (
    <div className={cn('space-y-6', className)}>

      {voice ? (
        <div
          className="rounded-2xl border border-black/10 bg-white/70 p-4 sm:p-5"
          style={{ borderColor: `${accentColor ?? 'var(--invite-border)'}55` }}
        >
          <p className="text-[11px] tracking-[0.18em] uppercase text-black/45">Voice note</p>
          <p className="mt-1 text-sm text-black/65">A message from the couple</p>
          <div className="mt-3">
            <audio controls className="w-full">
              <source src={voice.file_url} />
            </audio>
          </div>
        </div>
      ) : null}

      {orderedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {orderedVideos.map((v) => (
            <div
              key={v.id}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white/70"
              style={{ borderColor: `${accentColor ?? 'var(--invite-border)'}55` }}
            >
              <video controls playsInline className="w-full h-auto">
                <source src={v.file_url} />
              </video>
            </div>
          ))}
        </div>
      ) : null}

      {orderedPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {orderedPhotos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePhoto(p)}
              className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white"
              style={{ borderColor: `${accentColor ?? 'var(--invite-border)'}33` }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={p.file_url}
                  alt={p.file_name ?? 'Photo'}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white/60 p-4 text-sm text-black/60">
          No media uploaded yet.
        </div>
      )}

      <AnimatePresence>
        {activePhoto ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/70"
              onClick={() => setActivePhoto(null)}
            />
            <motion.div
              initial={{ scale: 0.98, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 10 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-2xl bg-black"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={activePhoto.file_url}
                  alt={activePhoto.file_name ?? 'Photo'}
                  fill
                  sizes="920px"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black text-white/80 text-xs">
                <span className="truncate">{activePhoto.file_name ?? 'Photo'}</span>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/15 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
