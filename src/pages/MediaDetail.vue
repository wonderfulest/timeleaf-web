<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <el-link href="/" :underline="false">返回时间轴</el-link>
    <h3 style="margin-top: 12px">Media Detail</h3>
    <div style="color: #909399">id: {{ route.params.id }}</div>
  </div>
</template>
