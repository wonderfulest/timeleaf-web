<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useChildStore } from '@/store/child'
import { useAlbumStore } from '@/store/album'

const childStore = useChildStore()
const albumStore = useAlbumStore()

const loading = ref(false)

const list = computed(() => {
  const childId = childStore.current?.id
  if (!childId) return []
  return albumStore.list.filter((a) => a.childId === childId)
})

async function refresh() {
  const childId = childStore.current?.id
  if (!childId) return
  loading.value = true
  try {
    await albumStore.refreshByChildId(childId)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '获取成长册失败')
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">成长册</h2>
      <el-link href="/" :underline="false">返回时间轴</el-link>
    </div>

    <div style="margin-top: 16px">
      <el-alert
        v-if="!childStore.current"
        title="请先选择孩子"
        type="warning"
        :closable="false"
        style="margin-bottom: 12px"
      >
        <template #default>
          <el-link href="/children" :underline="false">去选择孩子</el-link>
        </template>
      </el-alert>

      <el-skeleton v-else-if="loading" :rows="4" animated />

      <el-empty v-else-if="list.length === 0" description="该孩子还没有成长册" />

      <el-card v-else v-for="a in list" :key="a.id" style="margin-bottom: 12px">
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <div style="font-weight: 600">{{ a.title }}</div>
            <div style="margin-top: 6px; color: #909399">{{ a.description }}</div>
          </div>
          <el-link :href="`/albums/${a.id}/editor`" :underline="false">编辑</el-link>
        </div>
      </el-card>
    </div>
  </div>
</template>
