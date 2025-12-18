<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useChildStore } from '@/store/child'
import { useAlbumStore } from '@/store/album'

const route = useRoute()
const router = useRouter()
const childStore = useChildStore()
const albumStore = useAlbumStore()

const loading = ref(false)
const saving = ref(false)

const form = reactive({
  id: '',
  childId: '',
  title: '',
  description: '',
  startDate: '' as string | undefined,
  endDate: '' as string | undefined,
  theme: '' as string | undefined
})

const albumId = computed(() => String(route.params.id || ''))

async function load() {
  if (!albumId.value) return
  if (!childStore.current) return

  loading.value = true
  try {
    const a = await albumStore.getById(albumId.value)
    if (a.childId !== childStore.current.id) {
      ElMessage.error('该成长册不属于当前孩子')
      await router.replace('/albums')
      return
    }

    form.id = a.id
    form.childId = a.childId
    form.title = a.title
    form.description = a.description || ''
    form.startDate = a.startDate
    form.endDate = a.endDate
    form.theme = a.theme
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!childStore.current) {
    ElMessage.error('请先选择孩子')
    return
  }
  if (!form.title.trim()) {
    ElMessage.error('请输入标题')
    return
  }

  saving.value = true
  try {
    await albumStore.save({
      id: form.id,
      childId: childStore.current.id,
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      theme: form.theme
    })
    ElMessage.success('已保存')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <el-link href="/albums" :underline="false">返回成长册列表</el-link>

    <h2 style="margin-top: 12px">成长册编辑</h2>

    <el-alert v-if="!childStore.current" title="请先选择孩子" type="warning" :closable="false" style="margin-top: 12px">
      <template #default>
        <el-link href="/children" :underline="false">去选择孩子</el-link>
      </template>
    </el-alert>

    <el-skeleton v-else-if="loading" :rows="6" animated style="margin-top: 12px" />

    <el-card v-else style="margin-top: 12px">
      <div style="display: grid; gap: 12px">
        <el-input v-model="form.title" placeholder="标题" />
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="描述（可选）" />

        <div style="display: flex; gap: 12px">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="开始日期（可选）"
            style="flex: 1"
          />
          <el-date-picker
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="结束日期（可选）"
            style="flex: 1"
          />
        </div>

        <el-input v-model="form.theme" placeholder="主题（可选）" />

        <div style="display: flex; justify-content: flex-end">
          <el-button type="primary" :loading="saving" @click="save">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
