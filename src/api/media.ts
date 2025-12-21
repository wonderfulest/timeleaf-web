import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export async function listRecycleBinByChildId(childId: string): Promise<RecycleBinMediaVO[]> {
  const resp = await http<Result<RecycleBinMediaVO[]>>(`/api/media/recycle-bin?childId=${encodeURIComponent(childId)}`, {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取失败')
  }
  return resp.data
}

export async function deleteMediaToRecycleBin(id: string): Promise<boolean> {
  const resp = await http<Result<boolean>>(`/api/media/${encodeURIComponent(id)}/delete`, {
    method: 'POST'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '删除失败')
  }
  return resp.data
}

export async function restoreMedia(id: string): Promise<boolean> {
  const resp = await http<Result<boolean>>(`/api/media/${encodeURIComponent(id)}/restore`, {
    method: 'POST'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '恢复失败')
  }
  return resp.data
}

export async function purgeMedia(id: string): Promise<boolean> {
  const resp = await http<Result<boolean>>(`/api/media/${encodeURIComponent(id)}/purge`, {
    method: 'DELETE'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '删除失败')
  }
  return resp.data
}

export interface MediaCreateDTO {
  id: string
  childId: string
  type: string
  filePath: string
  size?: number
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
  originalFilePath?: string
  webFilePath?: string
  transcodeStatus?: string
  transcodeError?: string
  fileExt?: string
  duration?: number
  shootAt: string
  latitude?: number
  longitude?: number
  width?: number
  height?: number
  size?: number
  note?: string
  createdAt?: string
}

export interface RecycleBinMediaVO {
  id: string
  childId: string
  type: string
  filePath: string
  deletedAt?: string
  expireAt?: string
  remainDays?: number
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
