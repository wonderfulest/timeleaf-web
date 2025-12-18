import { defineStore } from 'pinia'
import type { Album } from '@/models/album'
import { getAlbumById, listAlbums, updateAlbum } from '@/api/album'

export const useAlbumStore = defineStore('album', {
  state: () => ({
    list: [] as Album[]
  }),
  actions: {
    async refreshByChildId(childId: string) {
      const list = await listAlbums(childId)
      this.list = list.map((x) => ({
        id: x.id,
        childId: x.childId,
        title: x.title,
        description: x.description,
        startDate: x.startDate,
        endDate: x.endDate,
        theme: x.theme
      }))
      return this.list
    },
    async getById(id: string) {
      const a = await getAlbumById(id)
      return {
        id: a.id,
        childId: a.childId,
        title: a.title,
        description: a.description,
        startDate: a.startDate,
        endDate: a.endDate,
        theme: a.theme
      } as Album
    },
    async save(album: Album) {
      const updated = await updateAlbum({
        id: album.id,
        childId: album.childId,
        title: album.title,
        description: album.description,
        startDate: album.startDate,
        endDate: album.endDate,
        theme: album.theme
      })

      const next: Album = {
        id: updated.id,
        childId: updated.childId,
        title: updated.title,
        description: updated.description,
        startDate: updated.startDate,
        endDate: updated.endDate,
        theme: updated.theme
      }

      const idx = this.list.findIndex((x) => x.id === next.id)
      if (idx >= 0) this.list.splice(idx, 1, next)
      return next
    },
    clear() {
      this.list = []
    }
  }
})
