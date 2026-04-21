import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET } from '@/lib/constants'
import type { MediaAsset } from '@/types/order.types'

export type MediaType = 'photos' | 'videos' | 'voice' | 'song'

const MEDIA_FOLDERS: Record<MediaType, string> = {
  photos: 'photos',
  videos: 'videos',
  voice: 'voice',
  song: 'song',
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
}

export async function uploadMediaFile(file: File, type: MediaType): Promise<MediaAsset> {
  const supabase = createClient()
  const objectPath = `${MEDIA_FOLDERS[type]}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(objectPath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message || 'Failed to upload file')
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath)

  return {
    name: file.name,
    url: data.publicUrl,
    path: objectPath,
    mimeType: file.type,
    size: file.size,
  }
}

export async function deleteMediaFile(path: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path])
  if (error) {
    throw new Error(error.message || 'Failed to delete file')
  }
}
