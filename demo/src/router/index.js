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
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
      }
    ]
  },

  // 博客管理
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog',
    
    children: [
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/index'),
        meta:{
          name:['博客管理','文章管理']
        }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta:{
          name:['博客管理','分类管理']
        }
      },
      {
        path: 'label',
        name: 'Label',
        component: () => import('@/views/label/index'),
        meta:{
          name:['博客管理','标签管理']
        }
      },
    ]
  },

  // 广告管理
  {
    path: '/advert',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Advert',
        component: () => import('@/views/advert/index'),
        meta:{
          name:['广告管理']
        }
      }
    ]
  },

  // 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/index'), // Parent router-view
        name: 'User',
        meta:{
          name:['系统管理','用户管理']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/role/index'),
        name: 'Role',
        meta:{
          name:['系统管理','角色管理']
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/menu/index'),
        name: 'Menu',
        meta:{
          name:['系统管理','菜单管理']
        }
      },
    ]
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
