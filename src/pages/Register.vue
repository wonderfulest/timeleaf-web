<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await register({ username: form.username, password: form.password })
    ElMessage.success('注册成功，请登录')
    await router.replace('/login')
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width: 420px; margin: 0 auto; padding: 24px">
    <h2 style="margin: 0">注册</h2>

    <el-card style="margin-top: 12px">
      <el-form @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" autocomplete="new-password" show-password />
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input v-model="form.confirmPassword" type="password" autocomplete="new-password" show-password />
        </el-form-item>

        <div style="display: flex; justify-content: space-between; align-items: center">
          <el-link href="/login" :underline="false">返回登录</el-link>
          <el-button type="primary" :loading="loading" @click="onSubmit">注册</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
