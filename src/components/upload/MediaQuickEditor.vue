<script setup lang="ts">
import type { UploadItem } from '@/models/upload'
import { formatAge } from '@/utils/age'
import { useChildStore } from '@/store/child'

defineProps<{ item: UploadItem; tagOptions: Array<{ id: string; name: string }> }>()

const childStore = useChildStore()
</script>

<template>
  <el-card style="margin-top: 12px">
    <div style="display: flex; gap: 12px">
      <img
        v-if="item.type === 'photo'"
        :src="item.previewUrl"
        style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px"
      />

      <video
        v-else
        :src="item.previewUrl"
        style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px"
        preload="metadata"
        muted
      />

      <div style="flex: 1">
        <div style="font-size: 12px; color: #606266">
          {{ item.shootAt }} · {{ childStore.current ? formatAge(childStore.current.birthday, item.shootAt) : '' }}
        </div>

        <el-date-picker
          v-model="item.shootAt"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="small"
          style="margin-top: 8px; width: 100%"
        />

        <el-select
          v-model="item.tagIds"
          multiple
          filterable
          allow-create
          default-first-option
          reserve-keyword
          placeholder="添加标签（可搜索/回车创建）"
          size="small"
          style="margin-top: 8px; width: 100%"
        >
          <el-option v-for="t in tagOptions" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>

        <el-input
          v-model="item.note"
          placeholder="这一刻发生了什么？（可选）"
          size="small"
          style="margin-top: 8px"
        />

        <div style="font-size: 12px; margin-top: 6px; color: #909399">
          状态：{{ item.status }}
          <span v-if="item.errorMessage" style="margin-left: 8px; color: #f56c6c">{{ item.errorMessage }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>
