import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import Welcome from '@/components/welcome.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: 'login' },
    { name: 'login', path: '/login', component: Login },

    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'welcome', path: '/welcome', component: Welcome },
        { name: 'rights', path: '/rights', component: Right },
        { name: 'roles', path: '/roles', component: Role }
      ]
    }
  ]
})

// 导航守卫 统一判断token 在路由配置生效之前生效
router.beforeEach((to, form, next) => {
  const token = sessionStorage.getItem('token')
  if (to.path === '/login') next()
  if (!token) {
    Message.warning('请先登录')
    return next('/login')
  }
  next()
})

export default router
