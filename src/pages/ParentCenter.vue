<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useChildStore } from '@/store/child'
import { useMediaStore } from '@/store/media'
import { listRecycleBinByChildId } from '@/api/media'
import { getStorageSummary, type StorageSummaryVO } from '@/api/parent'

const childStore = useChildStore()
const mediaStore = useMediaStore()

const recycleCount = ref(0)
const recycleLoading = ref(false)

const storage = ref<StorageSummaryVO | null>(null)
const storageLoading = ref(false)

const currentChildId = computed(() => childStore.current?.id || '')

const currentMediaList = computed(() => {
  const id = currentChildId.value
  if (!id) return []
  return mediaStore.byChildId(id)
})

const photoCount = computed(() => currentMediaList.value.filter((m) => m.type === 'photo').length)
const videoCount = computed(() => currentMediaList.value.filter((m) => m.type === 'video').length)

const storagePercent = computed(() => {
  const ratio = storage.value?.usedRatio
  if (typeof ratio !== 'number' || Number.isNaN(ratio)) return 0
  return Math.max(0, Math.min(100, Math.round(ratio * 100)))
})

const storageCategories = computed(() => storage.value?.categories || [])

async function refreshRecycleBin() {
  const id = currentChildId.value
  if (!id) {
    recycleCount.value = 0
    return
  }
  recycleLoading.value = true
  try {
    const list = await listRecycleBinByChildId(id)
    recycleCount.value = list.length
  } catch (e) {
    recycleCount.value = 0
  } finally {
    recycleLoading.value = false
  }
}

async function refresh() {
  try {
    await childStore.refreshList()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '获取孩子列表失败')
  }

  try {
    await childStore.refreshCurrent()
  } catch {
    // ignore
  }

  if (childStore.current?.id) {
    try {
      await mediaStore.refreshByChildId(childStore.current.id)
    } catch (e) {
      ElMessage.error(e instanceof Error ? e.message : '获取素材失败')
    }
  }

  storageLoading.value = true
  try {
    storage.value = await getStorageSummary()
  } catch (e) {
    storage.value = null
    ElMessage.error(e instanceof Error ? e.message : '获取空间统计失败')
  } finally {
    storageLoading.value = false
  }

  await refreshRecycleBin()
}

watch(
  () => childStore.current?.id,
  async (id) => {
    if (!id) return
    try {
      await mediaStore.refreshByChildId(id)
    } catch {
      // ignore
    }
    await refreshRecycleBin()
  }
)

onMounted(refresh)
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">家长中心</h2>
      <el-link href="/" :underline="false">返回时间轴</el-link>
    </div>

    <div style="margin-top: 12px">
      <el-card>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span style="font-weight: 600">我的孩子</span>
            <el-link href="/children" :underline="false">切换/管理</el-link>
          </div>
        </template>

        <el-empty v-if="childStore.list.length === 0" description="还没有孩子" />

        <div v-else style="display: flex; flex-direction: column; gap: 10px">
          <el-card v-for="c in childStore.list" :key="c.id" shadow="never">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div>
                <div style="font-weight: 600">{{ c.name }}</div>
                <div style="margin-top: 4px; color: #909399; font-size: 12px">生日：{{ c.birthday }}</div>
              </div>
              <div>
                <el-tag v-if="childStore.current?.id === c.id" type="success">当前</el-tag>
                <el-button v-else size="small" @click="childStore.choose(c.id)">设为当前</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-card>
    </div>

    <div style="margin-top: 12px">
      <el-card>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span style="font-weight: 600">使用空间</span>
            <span style="color: #909399; font-size: 12px">（真实占用，单位由后端格式化）</span>
          </div>
        </template>

        <el-alert
          v-if="!childStore.current"
          title="请先选择孩子"
          type="warning"
          :closable="false"
          style="margin-bottom: 12px"
        />

        <el-skeleton v-else-if="storageLoading" :rows="3" animated />

        <div v-else-if="storage">
          <el-alert
            v-if="storage.nearFull"
            title="空间快满了（已使用 80%+），建议清理垃圾站"
            type="warning"
            :closable="false"
            style="margin-bottom: 12px"
          />

          <el-progress :percentage="storagePercent" :stroke-width="12" />

          <div style="margin-top: 8px; color: #606266">
            {{ storage.formatted.used }} / {{ storage.formatted.total }}
            <span style="color: #909399">（剩余 {{ storage.formatted.remain }}）</span>
          </div>

          <div style="margin-top: 12px">
            <el-card v-for="c in storageCategories" :key="c.type" shadow="never" style="margin-bottom: 8px">
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div style="font-weight: 600">{{ c.label }}</div>
                <div style="color: #606266">{{ c.formatted }}</div>
              </div>
            </el-card>
          </div>

          <div style="margin-top: 8px; color: #909399; font-size: 12px">
            提示：垃圾站素材将保留 30 天，彻底删除后才会释放空间。
          </div>
        </div>

        <el-empty v-else description="空间统计暂不可用" />
      </el-card>
    </div>

    <div style="margin-top: 12px">
      <el-card>
        <template #header>
          <span style="font-weight: 600">管理入口</span>
        </template>

        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <el-button type="primary" plain href="/children">我的孩子</el-button>
          <el-button type="primary" plain href="/recycle-bin" :loading="recycleLoading">垃圾站</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
