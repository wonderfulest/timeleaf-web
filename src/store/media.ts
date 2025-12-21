import { defineStore } from 'pinia'
import type { Media } from '@/models/media'
import { listMediaByChildId } from '@/api/media'

export const useMediaStore = defineStore('media', {
  state: () => ({
    list: [] as Media[]
  }),
  getters: {
    byChildId: (s) => (childId: string) => s.list.filter((m) => m.childId === childId)
  },
  actions: {
    async refreshByChildId(childId: string) {
      const list = await listMediaByChildId(childId)
      const mapped = list.map((x) => ({
        id: x.id,
        childId: x.childId,
        type: x.type as Media['type'],
        fileUrl: x.type === 'video' && x.webFilePath ? x.webFilePath : x.filePath,
        originalFileUrl: x.originalFilePath,
        webFileUrl: x.webFilePath,
        transcodeStatus: x.transcodeStatus,
        transcodeError: x.transcodeError,
        shootAt: x.shootAt,
        note: x.note
      }))

      const remained = this.list.filter((m) => m.childId !== childId)
      this.list = [...mapped, ...remained]
      return mapped
    },
    add(media: Media) {
      this.list.unshift(media)
    }
  }
})
