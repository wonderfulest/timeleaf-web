<script setup lang="ts">
import type { Media } from '@/models/media'
import MediaCard from '@/components/media/MediaCard.vue'

defineProps<{ media: Media; birthday: string }>()
</script>

<template>
  <MediaCard :media="media" :birthday="birthday" />
</template>
