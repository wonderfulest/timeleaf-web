import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface AlbumVO {
  id: string
  childId: string
  title: string
  description?: string
  startDate?: string
  endDate?: string
  theme?: string
  createdAt?: string
}

export interface AlbumCreateDTO {
  id: string
  childId: string
  title: string
  description?: string
  startDate?: string
  endDate?: string
  theme?: string
}

export interface AlbumUpdateDTO {
  id: string
  childId: string
  title: string
  description?: string
  startDate?: string
  endDate?: string
  theme?: string
}

export async function listAlbums(childId: string): Promise<AlbumVO[]> {
  const resp = await http<Result<AlbumVO[]>>(`/api/albums/list?childId=${encodeURIComponent(childId)}`, {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取成长册失败')
  }
  return resp.data
}

export async function getAlbumById(id: string): Promise<AlbumVO> {
  const resp = await http<Result<AlbumVO>>(`/api/albums/${encodeURIComponent(id)}`, {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取成长册失败')
  }
  return resp.data
}

export async function createAlbum(dto: AlbumCreateDTO): Promise<AlbumVO> {
  const resp = await http<Result<AlbumVO>>('/api/albums/create', {
    method: 'POST',
    body: JSON.stringify(dto)
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '创建成长册失败')
  }
  return resp.data
}

export async function updateAlbum(dto: AlbumUpdateDTO): Promise<AlbumVO> {
  const resp = await http<Result<AlbumVO>>('/api/albums/update', {
    method: 'POST',
    body: JSON.stringify(dto)
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '更新成长册失败')
  }
  return resp.data
}
