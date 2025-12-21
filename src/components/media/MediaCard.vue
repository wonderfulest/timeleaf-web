<script setup lang="ts">
import type { Media } from '@/models/media'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatAge } from '@/utils/age'
import { formatDateTime } from '@/utils/date'
import { deleteMediaToRecycleBin } from '@/api/media'
import { useChildStore } from '@/store/child'
import { useMediaStore } from '@/store/media'
import TimeleafVideoPlayer from '@/components/video/TimeleafVideoPlayer.vue'

defineProps<{ media: Media; birthday: string }>()

const childStore = useChildStore()
const mediaStore = useMediaStore()

async function handleDelete(id: string) {
  try {
    await ElMessageBox.confirm('删除后将进入垃圾站，30 天内可恢复。确定删除吗？', '删除素材', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
  } catch {
    return
  }

  try {
    await deleteMediaToRecycleBin(id)
    ElMessage.success('已移入垃圾站（30 天后自动清理）')
    const childId = childStore.current?.id
    if (childId) {
      await mediaStore.refreshByChildId(childId)
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}
</script>

<template>
  <el-card style="margin-bottom: 12px">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px">
      <div style="font-size: 12px; color: #909399">
        {{ formatDateTime(media.shootAt) }} · {{ formatAge(birthday, media.shootAt) }}
      </div>

      <el-dropdown trigger="click">
        <el-button text style="padding: 0 6px">...</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleDelete(media.id)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <img
      v-if="media.type === 'photo'"
      :src="media.fileUrl"
      style="width: 100%; border-radius: 8px"
    />

    <TimeleafVideoPlayer v-else-if="media.type === 'video'" :src="media.fileUrl" />
    <div v-if="media.note" style="margin-top: 8px">{{ media.note }}</div>
  </el-card>
</template>
