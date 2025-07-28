import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import VueFlowPage from '@/pages/VueFlowPage.vue'
import TiptapPage from '@/pages/TiptapPage.vue'
import EditorJsPage from '@/pages/EditorJsPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/vueflow',
    name: 'vueflow',
    component: VueFlowPage
  },
  {
    path: '/tiptap',
    name: 'tiptap',
    component: TiptapPage
  },
  {
    path: '/editorjs',
    name: 'editorjs',
    component: EditorJsPage
  }
]

const router = createRouter({
  history: createWebHistory('/icp-dashboard/'),
  routes
})

export default router 