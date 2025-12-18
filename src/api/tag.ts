import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface TagVO {
  id: string
  name: string
  color?: string
  createdAt?: string
}

export interface TagCreateDTO {
  id: string
  name: string
  color?: string
}

export async function listTags(): Promise<TagVO[]> {
  const resp = await http<Result<TagVO[]>>('/api/admin/tag/list', {
    method: 'GET'
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取标签失败')
  }

  return resp.data
}

export async function createTag(dto: TagCreateDTO): Promise<TagVO> {
  const resp = await http<Result<TagVO>>('/api/admin/tag/create', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '创建标签失败')
  }

  return resp.data
}
