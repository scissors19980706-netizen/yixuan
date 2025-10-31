// 使用 Vue Router 定义基础路由
import { createRouter, createWebHistory } from 'vue-router'

// 延迟加载页面以优化首屏
const Home = () => import('./views/Home.vue')
const Download = () => import('./views/Download.vue')
const Changelog = () => import('./views/Changelog.vue')
const Guides = () => import('./views/guides.vue')
const SubAccountManagement = () => import('./views/SubAccountManagement.vue')

/**
 * 创建路由实例
 * @returns {import('vue-router').Router}
 */
export function createAppRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: Home },
      { path: '/download', name: 'download', component: Download },
      { path: '/changelog', name: 'changelog', component: Changelog },
      { path: '/guides', name: 'guides', component: Guides },
      { path: '/sub-account-management', name: 'subAccountManagement', component: SubAccountManagement },
      { path: '/:pathMatch(.*)*', redirect: '/' }
    ],
    scrollBehavior() {
      return { top: 0 }
    }
  })
}


