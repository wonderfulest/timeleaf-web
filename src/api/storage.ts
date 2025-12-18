import { http } from './http'
import { useChildStore } from '@/store/child'
import { pinia } from '@/store/pinia'

export interface Result<T> {
  code: number
  msg: string
  data: T
}

export interface UploadPrepareReq {
  childId: string
  filename: string
  contentType: string
  size: number
  mediaType: 'image' | 'video'
}

export interface UploadPrepareResp {
  uploadId: string
  objectKey: string
  method: 'PUT'
  uploadUrl: string
  headers: Record<string, string>
  expiresIn: number
  maxSize: number
}

export interface UploadCompleteResp {
  fileUrl: string
  objectKey: string
}

export async function uploadFile(params: { file: File; folder?: string; suffix?: string }): Promise<string> {
  const childStore = useChildStore(pinia)
  const childId = childStore.current?.id
  if (!childId) {
    throw new Error('请先选择孩子')
  }

  const mediaType: 'image' | 'video' = params.file.type?.startsWith('video') ? 'video' : 'image'
  const contentType = params.file.type || 'application/octet-stream'

  const prepareReq: UploadPrepareReq = {
    childId,
    filename: params.file.name,
    contentType,
    size: params.file.size,
    mediaType
  }

  const prepared = await http<Result<UploadPrepareResp>>('/api/upload/prepare', {
    method: 'POST',
    body: JSON.stringify(prepareReq)
  })

  if (prepared.code !== 0) {
    throw new Error(prepared.msg || '上传失败')
  }

  const putResp = await fetch(prepared.data.uploadUrl, {
    method: prepared.data.method || 'PUT',
    headers: prepared.data.headers,
    body: params.file
  })

  if (!putResp.ok) {
    const text = await putResp.text().catch(() => '')
    throw new Error(text || `上传失败(直传) HTTP ${putResp.status}`)
  }

  const completed = await http<Result<UploadCompleteResp>>('/api/upload/complete', {
    method: 'POST',
    body: JSON.stringify({ uploadId: prepared.data.uploadId })
  })

  if (completed.code !== 0) {
    throw new Error(completed.msg || '上传失败')
  }

  return completed.data.fileUrl
}
