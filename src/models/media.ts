export type MediaType = 'photo' | 'video'

export interface Media {
  id: string
  childId: string
  type: MediaType
  fileUrl: string
  shootAt: string
  note?: string
}
