<script setup lang="ts">
defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <div style="padding: 24px; text-align: center; color: #909399">
    <div style="font-size: 16px; font-weight: 600">{{ title ?? '暂无数据' }}</div>
    <div style="margin-top: 8px">{{ description ?? '请先添加一些内容' }}</div>
  </div>
</template>
