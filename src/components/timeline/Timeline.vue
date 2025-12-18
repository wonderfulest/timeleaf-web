<script setup lang="ts">
import type { Media } from '@/models/media'
import TimelineDay from './TimelineDay.vue'

defineProps<{ mediaList: Media[]; birthday: string }>()
</script>

<template>
  <div>
    <TimelineDay v-for="m in mediaList" :key="m.id" :media="m" :birthday="birthday" />
  </div>
</template>
