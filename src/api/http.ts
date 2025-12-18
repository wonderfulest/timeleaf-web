import { useUserStore } from '@/store/user'
import { pinia } from '@/store/pinia'

export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const apiBase = (import.meta as any).env?.VITE_API_BASE as string | undefined

  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData

  const headers = new Headers(init?.headers ?? {})
  if (!headers.has('Authorization')) {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      headers.set('Authorization', `Bearer ${userStore.token}`)
    }
  }
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const resolvedInput =
    typeof input === 'string' && apiBase && input.startsWith('/')
      ? `${apiBase.replace(/\/$/, '')}${input}`
      : input

  const resp = await fetch(resolvedInput, {
    headers,
    ...init
  })

  if (!resp.ok) {
    if (resp.status === 401) {
      const userStore = useUserStore(pinia)
      userStore.clearAuth()
    }
    const text = await resp.text()
    throw new Error(text || `HTTP ${resp.status}`)
  }

  return (await resp.json()) as T
}
