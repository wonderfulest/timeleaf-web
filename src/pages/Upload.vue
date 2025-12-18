<script setup lang="ts">
import UploadPanel from '@/components/upload/UploadPanel.vue'
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">快捷上传</h2>
      <el-link href="/" :underline="false">返回时间轴</el-link>
    </div>

    <div style="margin-top: 12px">
      <UploadPanel />
    </div>
  </div>
</template>
