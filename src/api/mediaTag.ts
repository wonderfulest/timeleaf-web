import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface MediaTagVO {
  mediaId: string
  tagId: string
}

export interface MediaTagCreateDTO {
  mediaId: string
  tagId: string
}

export async function createMediaTag(dto: MediaTagCreateDTO): Promise<MediaTagVO> {
  const resp = await http<Result<MediaTagVO>>('/api/media-tags/create', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '绑定标签失败')
  }

  return resp.data
}
