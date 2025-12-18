import { http } from './http'

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
  const resp = await http<AlbumVO[]>(`/api/admin/album/list?childId=${encodeURIComponent(childId)}`, {
    method: 'GET'
  })

  return resp
}

export async function getAlbumById(id: string): Promise<AlbumVO> {
  const resp = await http<AlbumVO>(`/api/admin/album/${id}` as string, {
    method: 'GET'
  })

  return resp
}

export async function createAlbum(dto: AlbumCreateDTO): Promise<AlbumVO> {
  const resp = await http<AlbumVO>('/api/admin/album/create', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  return resp
}

export async function updateAlbum(dto: AlbumUpdateDTO): Promise<AlbumVO> {
  const resp = await http<AlbumVO>('/api/admin/album/update', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  return resp
}
