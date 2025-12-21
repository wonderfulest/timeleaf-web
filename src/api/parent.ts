import { http } from './http'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface StorageCategoryVO {
  type: string
  label: string
  bytes: number
  formatted: string
}

export interface StorageFormattedVO {
  total: string
  used: string
  remain: string
}

export interface StorageSummaryVO {
  totalBytes: number
  usedBytes: number
  usedRatio: number
  formatted: StorageFormattedVO
  categories: StorageCategoryVO[]
  nearFull: boolean
}

export async function getStorageSummary(): Promise<StorageSummaryVO> {
  const resp = await http<Result<StorageSummaryVO>>('/api/parent/storage-summary', {
    method: 'GET'
  })
  if (resp.code !== 0) {
    throw new Error(resp.msg || '获取空间统计失败')
  }
  return resp.data
}
