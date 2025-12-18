import dayjs from 'dayjs'
import type { UploadItem } from '@/models/upload'

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createUploadItem(file: File): UploadItem {
  const isVideo = file.type.startsWith('video')

  return {
    id: createId(),
    file,
    type: isVideo ? 'video' : 'photo',
    previewUrl: URL.createObjectURL(file),
    shootAt: dayjs(file.lastModified).format('YYYY-MM-DD HH:mm:ss'),
    tagIds: [],
    status: 'pending'
  }
}

export function disposeUploadItem(item: UploadItem) {
  try {
    URL.revokeObjectURL(item.previewUrl)
  } catch {
    // ignore
  }
}
