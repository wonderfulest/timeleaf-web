import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface UserVO {
  id: number
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
}

export interface LoginDTO {
  username: string
  password: string
}

export interface LoginResponseVO {
  token: string
  user: UserVO
}

export async function login(dto: LoginDTO): Promise<LoginResponseVO> {
  const resp = await http<Result<LoginResponseVO>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '登录失败')
  }

  return resp.data
}

export interface RegisterDTO {
  username: string
  password: string
}

export async function register(dto: RegisterDTO): Promise<boolean> {
  const resp = await http<Result<boolean>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto)
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '注册失败')
  }

  return resp.data
}

export async function getUserInfo(): Promise<UserVO> {
  const resp = await http<Result<UserVO>>('/api/users/info', {
    method: 'GET'
  })

  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取用户信息失败')
  }

  return resp.data
}
