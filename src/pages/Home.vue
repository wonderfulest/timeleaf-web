<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Timeline from '@/components/timeline/Timeline.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useChildStore } from '@/store/child'
import { useMediaStore } from '@/store/media'
import { useUserStore } from '@/store/user'
import { getUserInfo } from '@/api/auth'

const childStore = useChildStore()
const mediaStore = useMediaStore()
const userStore = useUserStore()

const currentMediaList = computed(() => {
  const childId = childStore.current?.id
  if (!childId) return []
  return mediaStore.byChildId(childId)
})

watch(
  () => childStore.current?.id,
  async (childId) => {
    if (!userStore.token) return
    if (!childId) return
    try {
      await mediaStore.refreshByChildId(childId)
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '获取照片失败')
    }
  },
  { immediate: true }
)

async function logout() {
  userStore.clearAuth()
  childStore.clear()
  window.location.href = '/login'
}

onMounted(async () => {
  if (!userStore.token) return
  if (userStore.user) return
  try {
    userStore.setUser(await getUserInfo())
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '获取用户信息失败')
  }
})
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">Timeleaf</h2>
      <div style="display: flex; gap: 12px">
        <el-link href="/upload" :underline="false">快捷上传</el-link>
        <el-link href="/albums" :underline="false">成长册</el-link>
        <el-link href="javascript:void(0)" :underline="false" @click="logout">退出</el-link>
      </div>
    </div>

    <div style="margin-top: 8px; color: #606266">
      <template v-if="childStore.current">
        当前孩子：{{ childStore.current.name }}（生日：{{ childStore.current.birthday }}）
      </template>
      <template v-else>
        还未选择孩子，<el-link href="/children" :underline="false">去选择</el-link>
      </template>
    </div>

    <div style="margin-top: 16px">
      <EmptyState v-if="childStore.current && currentMediaList.length === 0" title="还没有照片" description="先用快捷上传加一条" />
      <Timeline v-else-if="childStore.current" :media-list="currentMediaList" :birthday="childStore.current.birthday" />
      <EmptyState v-else title="还未选择孩子" description="请先选择孩子" />
    </div>
  </div>
</template>
