<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useChildStore } from '@/store/child'

const router = useRouter()
const childStore = useChildStore()

const loading = ref(false)
const saving = ref(false)

const form = reactive({
  name: '',
  birthday: ''
})

const canCreate = computed(() => Boolean(form.birthday))

async function refresh() {
  loading.value = true
  try {
    await Promise.all([childStore.refreshList(), childStore.refreshCurrent()])

    if (childStore.current?.id) {
      await router.replace('/')
    }
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '加载失败')
  } finally {
    loading.value = false
  }
}

async function choose(childId: string) {
  saving.value = true
  try {
    await childStore.choose(childId)
    await router.replace('/')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '选择失败')
  } finally {
    saving.value = false
  }
}

async function create() {
  if (!form.birthday) {
    ElMessage.error('请选择生日')
    return
  }

  saving.value = true
  try {
    await childStore.createAndChoose({
      name: form.name,
      birthday: form.birthday
    })
    await router.replace('/')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '创建失败')
  } finally {
    saving.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto; padding: 16px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <h2 style="margin: 0">选择孩子</h2>
      <el-link href="/" :underline="false">返回</el-link>
    </div>

    <el-skeleton v-if="loading" :rows="4" animated style="margin-top: 12px" />

    <div v-else style="margin-top: 12px">
      <div v-if="childStore.list.length" style="display: grid; gap: 12px">
        <el-card v-for="c in childStore.list" :key="c.id">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>
              <div style="font-weight: 600">{{ c.name || '未命名' }}</div>
              <div style="margin-top: 6px; color: #909399">生日：{{ c.birthday }}</div>
            </div>
            <el-button type="primary" :loading="saving" @click="choose(c.id)">进入</el-button>
          </div>
        </el-card>
      </div>

      <el-card style="margin-top: 16px">
        <div style="font-weight: 600">新增孩子</div>
        <div style="margin-top: 8px; display: grid; gap: 12px">
          <el-input v-model="form.name" placeholder="名字（可选）" />
          <el-date-picker v-model="form.birthday" type="date" value-format="YYYY-MM-DD" placeholder="选择生日（必填）" />
          <div style="display: flex; justify-content: flex-end">
            <el-button type="primary" :disabled="!canCreate" :loading="saving" @click="create">创建并进入</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
