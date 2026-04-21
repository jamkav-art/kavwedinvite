'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import MediaUploader from '@/components/order/MediaUploader'
import { useOrderStore } from '@/hooks/useOrderStore'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import type { MediaAsset } from '@/types/order.types'

type MediaTab = 'photos' | 'videos' | 'voice' | 'song'

const TAB_CONFIG: Record<
  MediaTab,
  { label: string; accept: string; multiple: boolean; maxSizeMb: number; hint: string }
> = {
  photos: {
    label: 'Photos',
    accept: 'image/jpeg,image/png,image/webp',
    multiple: true,
    maxSizeMb: 8,
    hint: 'Upload couple photos for gallery (JPG, PNG, WEBP).',
  },
  videos: {
    label: 'Videos',
    accept: 'video/mp4,video/webm,video/quicktime',
    multiple: true,
    maxSizeMb: 30,
    hint: 'Upload pre-wedding clips or highlight videos.',
  },
  voice: {
    label: 'Voice Message',
    accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
    multiple: false,
    maxSizeMb: 12,
    hint: 'One short message from the couple.',
  },
  song: {
    label: 'Background Song',
    accept: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
    multiple: false,
    maxSizeMb: 15,
    hint: 'Background track that plays on the invite.',
  },
}

export default function Step3() {
  const [activeTab, setActiveTab] = useState<MediaTab>('photos')
  const { media, updateMedia, nextStep, prevStep } = useOrderStore()
  const { uploadByFile, uploadFile, deleteFile } = useMediaUpload()

  const filesForTab = useMemo(() => {
    if (activeTab === 'voice') return media.voice ? [media.voice] : []
    if (activeTab === 'song') return media.song ? [media.song] : []
    return media[activeTab]
  }, [activeTab, media])

  const handleUpload = async (files: File[]) => {
    if (activeTab === 'voice' || activeTab === 'song') {
      const first = files[0]
      if (!first) return
      const uploaded = await uploadFile(first, activeTab)
      updateMedia({ [activeTab]: uploaded })
      return
    }

    const uploaded = await Promise.all(files.map((file) => uploadFile(file, activeTab)))
    updateMedia({ [activeTab]: [...media[activeTab], ...uploaded] })
  }

  const handleRemove = async (asset: MediaAsset) => {
    await deleteFile(asset.path)

    if (activeTab === 'voice' || activeTab === 'song') {
      updateMedia({ [activeTab]: null })
      return
    }

    updateMedia({
      [activeTab]: media[activeTab].filter((item) => item.path !== asset.path),
    })
  }

  const hasAtLeastOneMedia =
    media.photos.length > 0 || media.videos.length > 0 || Boolean(media.voice) || Boolean(media.song)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-[var(--font-cormorant)] font-semibold text-[--color-charcoal] leading-tight">
          Upload your media
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Step 3 of 4 — photos, videos, voice message and background song
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(TAB_CONFIG) as MediaTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-3 py-2 text-sm font-medium border transition-colors ${
              activeTab === tab
                ? 'bg-[--color-charcoal] text-[--color-cream] border-[--color-charcoal]'
                : 'bg-white text-[--color-charcoal] border-gray-200 hover:border-gray-300'
            }`}
          >
            {TAB_CONFIG[tab].label}
          </button>
        ))}
      </div>

      <MediaUploader
        label={TAB_CONFIG[activeTab].label}
        hint={TAB_CONFIG[activeTab].hint}
        accept={TAB_CONFIG[activeTab].accept}
        type={activeTab}
        multiple={TAB_CONFIG[activeTab].multiple}
        maxSizeMb={TAB_CONFIG[activeTab].maxSizeMb}
        files={filesForTab}
        uploading={uploadByFile}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      {!hasAtLeastOneMedia && (
        <p className="text-xs text-gray-500">
          Add at least one media item so your invite looks complete.
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Button variant="secondary" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!hasAtLeastOneMedia}>
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
