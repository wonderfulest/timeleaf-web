<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }

  loading.value = true
  try {
    const resp = await login({ username: form.username, password: form.password })
    userStore.setAuth(resp.token, resp.user)

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width: 420px; margin: 0 auto; padding: 24px">
    <h2 style="margin: 0">登录</h2>

    <el-card style="margin-top: 12px">
      <el-form @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" autocomplete="current-password" show-password />
        </el-form-item>

        <div style="display: flex; justify-content: space-between; align-items: center">
          <el-link href="/register" :underline="false">去注册</el-link>
          <el-button type="primary" :loading="loading" @click="onSubmit">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
