<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useChildStore } from '@/store/child'
import { listRecycleBinByChildId, purgeMedia, restoreMedia, type RecycleBinMediaVO } from '@/api/media'

const childStore = useChildStore()

const loading = ref(false)
const list = ref<RecycleBinMediaVO[]>([])

const childId = computed(() => childStore.current?.id || '')

async function refresh() {
  if (!childId.value) return
  loading.value = true
  try {
    list.value = await listRecycleBinByChildId(childId.value)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '获取垃圾站失败')
  } finally {
    loading.value = false
  }
}

async function handleRestore(id: string) {
  try {
    await restoreMedia(id)
    ElMessage.success('已恢复')
    await refresh()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '恢复失败')
  }
}

async function handlePurge(id: string) {
  try {
    await ElMessageBox.confirm('彻底删除后将无法恢复，确定要删除吗？', '确认删除', {
      type: 'warning',
      confirmButtonText: '彻底删除',
      cancelButtonText: '取消'
    })
  } catch {
    return
  }

  try {
    await purgeMedia(id)
    ElMessage.success('已彻底删除')
    await refresh()
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '删除失败')
  }
}

watch(
  () => childStore.current?.id,
  async () => {
    await refresh()
  }
)

onMounted(refresh)
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">垃圾站</h2>
      <el-link href="/" :underline="false">返回时间轴</el-link>
    </div>

    <div style="margin-top: 12px; color: #606266">
      <template v-if="childStore.current">
        当前孩子：{{ childStore.current.name }}
      </template>
      <template v-else>
        还未选择孩子，<el-link href="/children" :underline="false">去选择</el-link>
      </template>
    </div>

    <div style="margin-top: 16px">
      <el-alert
        v-if="!childStore.current"
        title="请先选择孩子"
        type="warning"
        :closable="false"
        style="margin-bottom: 12px"
      />

      <el-skeleton v-else-if="loading" :rows="4" animated />

      <el-empty v-else-if="list.length === 0" description="垃圾站是空的（删除的照片会在这里保留 30 天）" />

      <el-card v-else v-for="m in list" :key="m.id" style="margin-bottom: 12px">
        <div style="display: flex; gap: 12px">
          <div style="width: 96px; height: 96px; flex: 0 0 auto; border-radius: 8px; overflow: hidden; background: #f2f3f5">
            <img v-if="m.type === 'photo'" :src="m.filePath" style="width: 100%; height: 100%; object-fit: cover" />
            <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #909399">
              视频
            </div>
          </div>

          <div style="flex: 1">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <div style="font-weight: 600">{{ m.type === 'photo' ? '照片' : '视频' }}</div>
              <el-tag v-if="typeof m.remainDays === 'number'" type="info">剩余 {{ m.remainDays }} 天</el-tag>
            </div>

            <div style="margin-top: 6px; color: #909399">
              <div v-if="m.deletedAt">删除时间：{{ m.deletedAt }}</div>
              <div v-if="m.expireAt">到期时间：{{ m.expireAt }}</div>
            </div>

            <div style="margin-top: 10px; display: flex; gap: 8px">
              <el-button type="primary" @click="handleRestore(m.id)">恢复</el-button>
              <el-button type="danger" plain @click="handlePurge(m.id)">彻底删除</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
