<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { UploadItem } from '@/models/upload'
import { createUploadItem, disposeUploadItem } from './useUpload'
import MediaQuickEditor from './MediaQuickEditor.vue'
import { useMediaStore } from '@/store/media'
import { useChildStore } from '@/store/child'
import type { UploadFile } from 'element-plus'
import { uploadFile } from '@/api/storage'
import { batchCreateMedia } from '@/api/media'
import { createMediaTag } from '@/api/mediaTag'
import { createTag, listTags } from '@/api/tag'

const items = ref<UploadItem[]>([])
const mediaStore = useMediaStore()
const childStore = useChildStore()

const tagOptions = ref<Array<{ id: string; name: string }>>([])

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function refreshTags() {
  const list = await listTags()
  tagOptions.value = list.map((x) => ({ id: x.id, name: x.name }))
}

async function ensureItemTags(item: UploadItem) {
  if (!item.tagIds?.length) return

  const idSet = new Set(tagOptions.value.map((t) => t.id))
  const nameToId = new Map(tagOptions.value.map((t) => [t.name, t.id]))

  const ensured: string[] = []

  for (const v of item.tagIds) {
    if (idSet.has(v)) {
      ensured.push(v)
      continue
    }

    const name = v.trim()
    if (!name) continue

    const existing = nameToId.get(name)
    if (existing) {
      ensured.push(existing)
      continue
    }

    const created = await createTag({ id: createId(), name })
    tagOptions.value.unshift({ id: created.id, name: created.name })
    idSet.add(created.id)
    nameToId.set(created.name, created.id)
    ensured.push(created.id)
  }

  item.tagIds = Array.from(new Set(ensured))
}

async function bindTagsForItem(item: UploadItem) {
  if (!item.tagIds?.length) return
  await Promise.all(item.tagIds.map((tagId) => createMediaTag({ mediaId: item.id, tagId })))
}

function handleFiles(files: File[]) {
  files.forEach((file) => {
    items.value.unshift(createUploadItem(file))
  })
}

function removeItem(id: string) {
  const idx = items.value.findIndex((x) => x.id === id)
  if (idx < 0) return
  const item = items.value[idx]
  disposeUploadItem(item)
  items.value.splice(idx, 1)
}

const canSave = computed(() => items.value.some((x) => x.status === 'pending' || x.status === 'error'))

function clearAll() {
  items.value.forEach(disposeUploadItem)
  items.value = []
}

async function saveOne(item: UploadItem) {
  item.status = 'saving'
  item.errorMessage = undefined

  try {
    const childId = childStore.current?.id
    if (!childId) {
      throw new Error('请先选择孩子')
    }

    await ensureItemTags(item)

    const suffix = (item.file.name.split('.').pop() || 'png').toLowerCase()
    const fileUrl = await uploadFile({
      file: item.file,
      folder: 'media',
      suffix
    })

    await batchCreateMedia([
      {
        id: item.id,
        childId,
        type: item.type,
        filePath: fileUrl,
        fileExt: suffix,
        shootAt: item.shootAt,
        note: item.note
      }
    ])

    await bindTagsForItem(item)

    mediaStore.add({
      id: item.id,
      childId,
      type: item.type,
      fileUrl,
      shootAt: item.shootAt,
      note: item.note
    })

    item.status = 'done'
  } catch (e) {
    item.status = 'error'
    item.errorMessage = e instanceof Error ? e.message : '保存失败'
  }
}

async function saveAll() {
  const targets = items.value.filter((x) => x.status === 'pending' || x.status === 'error')
  if (!targets.length) return

  const childId = childStore.current?.id
  if (!childId) {
    for (const item of targets) {
      item.status = 'error'
      item.errorMessage = '请先选择孩子'
    }
    return
  }

  for (const item of targets) {
    item.status = 'saving'
    item.errorMessage = undefined
  }

  try {
    for (const item of targets) {
      // eslint-disable-next-line no-await-in-loop
      await ensureItemTags(item)
    }

    const uploaded = [] as Array<{ item: UploadItem; fileUrl: string; suffix: string }>
    for (const item of targets) {
      // eslint-disable-next-line no-await-in-loop
      const suffix = (item.file.name.split('.').pop() || 'png').toLowerCase()
      // eslint-disable-next-line no-await-in-loop
      const fileUrl = await uploadFile({ file: item.file, folder: 'media', suffix })
      uploaded.push({ item, fileUrl, suffix })
    }

    const dtoList = uploaded.map(({ item, fileUrl, suffix }) => ({
      id: item.id,
      childId,
      type: item.type,
      filePath: fileUrl,
      fileExt: suffix,
      shootAt: item.shootAt,
      note: item.note
    }))

    await batchCreateMedia(dtoList)

    await Promise.all(uploaded.map(({ item }) => bindTagsForItem(item)))

    for (const { item, fileUrl } of uploaded) {
      mediaStore.add({
        id: item.id,
        childId,
        type: item.type,
        fileUrl,
        shootAt: item.shootAt,
        note: item.note
      })
      item.status = 'done'
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '保存失败'
    for (const item of targets) {
      if (item.status === 'saving') {
        item.status = 'error'
        item.errorMessage = msg
      }
    }
  }
}

onBeforeUnmount(() => {
  items.value.forEach(disposeUploadItem)
})

onMounted(async () => {
  await refreshTags()
})
</script>

<template>
  <div>
    <el-upload
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      accept="image/*,video/*"
      :on-change="(file: UploadFile) => handleFiles([file.raw!])"
    >
      <div style="padding: 12px">
        <div style="font-size: 14px; font-weight: 600">拖拽照片或视频到这里</div>
        <div style="margin-top: 4px; font-size: 12px; color: #909399">也可以点击选择，支持连续添加</div>
      </div>
    </el-upload>

    <div v-for="item in items" :key="item.id">
      <div style="display: flex; justify-content: flex-end; margin-top: 8px">
        <el-button
          v-if="item.status !== 'saving'"
          size="small"
          type="danger"
          plain
          @click="removeItem(item.id)"
        >
          移除
        </el-button>
      </div>
      <MediaQuickEditor :item="item" :tag-options="tagOptions" />
    </div>

    <div v-if="items.length" style="margin-top: 16px; display: flex; gap: 8px">
      <el-button type="primary" :disabled="!canSave" @click="saveAll">保存 {{ items.length }} 条记录</el-button>
      <el-button @click="clearAll">清空</el-button>
    </div>
  </div>
</template>
