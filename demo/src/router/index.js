import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../components/Layout'


Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '首页', icon: 'dashboard', affix: true }, //固钉
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
    }]
  },

  // 博客管理
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog',
    name: 'Blog',
    meta: { title: '博客管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/index'),
        meta: { title: '文章管理', icon: 'el-icon-notebook-1' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理', icon: 'el-icon-s-order' }
      },
      {
        path: 'label',
        name: 'Label',
        component: () => import('@/views/label/index'),
        meta: { title: '标签管理', icon: 'el-icon-collection-tag' }
      },
    ]
  },

  // 广告管理
  {
    path: '/advert',
    component: Layout,
    meta: { title: '广告管理', icon: 'el-icon-picture-outline-round' },
    children: [
      {
        path: 'index',
        name: 'Advert',
        component: () => import('@/views/advert/index'),
      }
    ]
  },

  // 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index'), // Parent router-view
        name: 'User',
        meta: { title: '用户管理', icon: 'el-icon-user-solid' },
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'el-icon-coin' }
      },
      {
        path: 'menu',
        component: () => import('@/views/menu/index'),
        name: 'Menu',
        meta: { title: '菜单管理', icon: 'el-icon-menu' }
      },
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'Al后台官网', icon: 'link' }
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
