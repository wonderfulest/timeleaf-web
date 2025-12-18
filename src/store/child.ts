import { defineStore } from 'pinia'
import type { Child } from '@/models/child'
import { createMyChild, getCurrentChild, listMyChildren, selectCurrentChild } from '@/api/child'

export const useChildStore = defineStore('child', {
  state: () => ({
    current: null as Child | null,
    list: [] as Child[]
  }),
  getters: {
    hasCurrent: (s) => Boolean(s.current && s.current.id)
  },
  actions: {
    async refreshList() {
      const list = await listMyChildren()
      this.list = list.map((x) => ({ id: x.id, name: x.name, birthday: x.birthday }))
      return this.list
    },
    async refreshCurrent() {
      const current = await getCurrentChild()
      this.current = current ? { id: current.id, name: current.name, birthday: current.birthday } : null
      return this.current
    },
    async choose(childId: string) {
      await selectCurrentChild(childId)
      await this.refreshCurrent()
    },
    async createAndChoose(dto: { name?: string; birthday: string; gender?: string; avatarPath?: string }) {
      const created = await createMyChild(dto)
      await this.choose(created.id)
      return created
    },
    clear() {
      this.current = null
      this.list = []
    }
  }
})
