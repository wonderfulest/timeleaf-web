export type MediaType = 'photo' | 'video'

export interface Media {
  id: string
  childId: string
  type: MediaType
  fileUrl: string
  originalFileUrl?: string
  webFileUrl?: string
  transcodeStatus?: string
  transcodeError?: string
  shootAt: string
  note?: string
}
