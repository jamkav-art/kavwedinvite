import { useState } from 'react'
import { deleteMediaFile, uploadMediaFile, type MediaType } from '@/lib/supabase-storage'
import type { MediaAsset } from '@/types/order.types'

interface UploadState {
  progress: number
  isUploading: boolean
  error: string | null
}

export function useMediaUpload() {
  const [uploadByFile, setUploadByFile] = useState<Record<string, UploadState>>({})

  const setProgress = (key: string, patch: Partial<UploadState>) => {
    setUploadByFile((prev) => ({
      ...prev,
      [key]: {
        progress: prev[key]?.progress ?? 0,
        isUploading: prev[key]?.isUploading ?? false,
        error: prev[key]?.error ?? null,
        ...patch,
      },
    }))
  }

  const uploadFile = async (file: File, type: MediaType): Promise<MediaAsset> => {
    const key = `${file.name}-${file.size}-${file.lastModified}`
    setProgress(key, { progress: 10, isUploading: true, error: null })

    try {
      setProgress(key, { progress: 45 })
      const uploaded = await uploadMediaFile(file, type)
      setProgress(key, { progress: 100, isUploading: false })
      return uploaded
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setProgress(key, { isUploading: false, error: message })
      throw error
    }
  }

  const deleteFile = async (path: string) => {
    await deleteMediaFile(path)
  }

  return {
    uploadByFile,
    uploadFile,
    deleteFile,
  }
}
