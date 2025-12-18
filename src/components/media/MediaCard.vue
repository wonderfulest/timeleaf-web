<script setup lang="ts">
import type { Media } from '@/models/media'
import { formatAge } from '@/utils/age'
import { formatDateTime } from '@/utils/date'

defineProps<{ media: Media; birthday: string }>()
</script>

<template>
  <el-card style="margin-bottom: 12px">
    <div style="font-size: 12px; color: #909399; margin-bottom: 8px">
      {{ formatDateTime(media.shootAt) }} · {{ formatAge(birthday, media.shootAt) }}
    </div>

    <img
      v-if="media.type === 'photo'"
      :src="media.fileUrl"
      style="width: 100%; border-radius: 8px"
    />

    <div v-if="media.note" style="margin-top: 8px">{{ media.note }}</div>
  </el-card>
</template>
