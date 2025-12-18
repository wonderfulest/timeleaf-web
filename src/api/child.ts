import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface ChildVO {
  id: string
  name: string
  birthday: string
  gender?: string
  avatarPath?: string
  createdAt?: string
}

export interface MyChildCreateDTO {
  name?: string
  birthday: string
  gender?: string
  avatarPath?: string
}

export async function listMyChildren(): Promise<ChildVO[]> {
  const resp = await http<Result<ChildVO[]>>('/api/users/children/list', {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取孩子列表失败')
  }
  return resp.data
}

export async function createMyChild(dto: MyChildCreateDTO): Promise<ChildVO> {
  const resp = await http<Result<ChildVO>>('/api/users/children/create', {
    method: 'POST',
    body: JSON.stringify(dto)
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '创建孩子失败')
  }
  return resp.data
}

export async function selectCurrentChild(childId: string): Promise<boolean> {
  const resp = await http<Result<boolean>>('/api/users/children/select', {
    method: 'POST',
    body: JSON.stringify({ childId })
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '选择孩子失败')
  }
  return resp.data
}

export async function getCurrentChild(): Promise<ChildVO | null> {
  const resp = await http<Result<ChildVO | null>>('/api/users/children/current', {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取当前孩子失败')
  }
  return resp.data
}
