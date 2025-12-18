export interface UploadItem {
  id: string
  file: File

  type: 'photo' | 'video'
  previewUrl: string

  shootAt: string
  note?: string

  tagIds?: string[]

  status: 'pending' | 'saving' | 'done' | 'error'
  errorMessage?: string
}
