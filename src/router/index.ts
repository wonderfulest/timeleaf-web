import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import MediaDetail from '@/pages/MediaDetail.vue'
import AlbumList from '@/pages/AlbumList.vue'
import AlbumEditor from '@/pages/AlbumEditor.vue'
import Upload from '@/pages/Upload.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import ChildSelect from '@/pages/ChildSelect.vue'

import { useUserStore } from '@/store/user'
import { useChildStore } from '@/store/child'
import { pinia } from '@/store/pinia'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/children', name: 'childSelect', component: ChildSelect, meta: { requiresAuth: true } },
  { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
  { path: '/upload', name: 'upload', component: Upload, meta: { requiresAuth: true } },
  { path: '/media/:id', name: 'mediaDetail', component: MediaDetail, meta: { requiresAuth: true } },
  { path: '/albums', name: 'albumList', component: AlbumList, meta: { requiresAuth: true } },
  { path: '/albums/:id/editor', name: 'albumEditor', component: AlbumEditor, meta: { requiresAuth: true } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.name === 'login' || to.name === 'register') return true
  if (!to.meta?.requiresAuth) return true

  const userStore = useUserStore(pinia)
  if (userStore.token) return true

  return {
    name: 'login',
    query: {
      redirect: to.fullPath
    }
  }
})

router.beforeEach(async (to) => {
  if (to.name === 'login' || to.name === 'register') return true
  if (!to.meta?.requiresAuth) return true

  const userStore = useUserStore(pinia)
  if (!userStore.token) return true

  if (to.name === 'childSelect') return true

  const childStore = useChildStore(pinia)
  if (!childStore.current) {
    try {
      await childStore.refreshCurrent()
    } catch {
      // ignore
    }
  }
  if (!childStore.current) {
    return { name: 'childSelect' }
  }

  return true
})
