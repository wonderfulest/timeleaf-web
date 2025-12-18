import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface MediaCreateDTO {
  id: string
  childId: string
  type: string
  filePath: string
  fileExt?: string
  duration?: number
  shootAt: string
  latitude?: number
  longitude?: number
  width?: number
  height?: number
  note?: string
}

export interface MediaVO {
  id: string
  childId: string
  type: string
  filePath: string
  fileExt?: string
  duration?: number
  shootAt: string
  latitude?: number
  longitude?: number
  width?: number
  height?: number
  note?: string
  createdAt?: string
}

export async function listMediaByChildId(childId: string): Promise<MediaVO[]> {
  const resp = await http<Result<MediaVO[]>>(`/api/media/list?childId=${encodeURIComponent(childId)}`, {
    method: 'GET'
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取失败')
  }

  return resp.data
}

export async function batchCreateMedia(list: MediaCreateDTO[]): Promise<MediaVO[]> {
  const resp = await http<Result<MediaVO[]>>('/api/media/batchCreate', {
    method: 'POST',
    body: JSON.stringify(list)
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '保存失败')
  }

  return resp.data
}
