import { defineStore } from 'pinia'
import type { UserVO } from '@/api/auth'

const TOKEN_KEY = 'timeleaf_token'

export function getStoredToken(): string {
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setStoredToken(token: string) {
  if (typeof localStorage === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getStoredToken(),
    user: null as UserVO | null
  }),
  getters: {
    isAuthed: (s) => Boolean(s.token)
  },
  actions: {
    setAuth(token: string, user: UserVO) {
      this.token = token
      this.user = user
      setStoredToken(token)
    },
    clearAuth() {
      this.token = ''
      this.user = null
      setStoredToken('')
    },
    setUser(user: UserVO | null) {
      this.user = user
    }
  }
})
