'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { MediaAsset } from '@/types/order.types'

interface MediaUploaderProps {
  label: string
  hint: string
  accept: string
  type: 'photos' | 'videos' | 'voice' | 'song'
  multiple?: boolean
  maxSizeMb: number
  files: MediaAsset[]
  uploading: Record<string, { progress: number; isUploading: boolean; error: string | null }>
  onUpload: (files: File[]) => Promise<void>
  onRemove: (asset: MediaAsset) => Promise<void>
}

export default function MediaUploader({
  label,
  hint,
  accept,
  type,
  multiple = false,
  maxSizeMb,
  files,
  uploading,
  onUpload,
  onRemove,
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (rawFiles: File[]) => {
    const maxBytes = maxSizeMb * 1024 * 1024
    for (const file of rawFiles) {
      if (file.size > maxBytes) {
        throw new Error(`${file.name} exceeds ${maxSizeMb}MB limit`)
      }
    }
    return rawFiles
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    try {
      setError(null)
      const validFiles = validateFiles(Array.from(fileList))
      await onUpload(validFiles)
      if (inputRef.current) inputRef.current.value = ''
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-[--color-charcoal]">{label}</h3>
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          void handleFiles(e.dataTransfer.files)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={cn(
          'rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer',
          dragActive
            ? 'border-[--color-charcoal] bg-gray-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        )}
      >
        <p className="text-sm font-medium text-[--color-charcoal]">Drag and drop or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">
          {multiple ? 'Select multiple files' : 'Select a single file'} • Max {maxSizeMb}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-[--color-terracotta]">{error}</p>}

      {Object.entries(uploading).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploading).map(([key, state]) => (
            <div key={key} className="rounded-lg border border-gray-200 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-600 truncate">{key.split('-').slice(0, -2).join('-')}</p>
                <span className="text-xs font-medium text-[--color-charcoal]">{state.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[--color-charcoal] transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
              {state.error && <p className="text-xs text-[--color-terracotta] mt-1">{state.error}</p>}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((asset) => (
            <div key={asset.path} className="rounded-xl border border-gray-200 bg-white p-3">
              {type === 'photos' && (
                <Image
                  src={asset.url}
                  alt={asset.name}
                  width={320}
                  height={180}
                  unoptimized
                  className="w-full h-28 object-cover rounded-lg border border-gray-100"
                />
              )}
              {type === 'videos' && (
                <video controls className="w-full h-28 rounded-lg border border-gray-100 bg-black/90">
                  <source src={asset.url} type={asset.mimeType} />
                </video>
              )}
              {(type === 'voice' || type === 'song') && (
                <audio controls className="w-full">
                  <source src={asset.url} type={asset.mimeType} />
                </audio>
              )}
              <p className="text-xs font-medium text-[--color-charcoal] truncate mt-2">{asset.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{(asset.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button
                type="button"
                className="text-xs text-[--color-terracotta] mt-2"
                onClick={() => void onRemove(asset)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
