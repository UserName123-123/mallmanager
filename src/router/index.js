import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Welcome from '@/components/welcome.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: 'login' },
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'welcome', path: '/welcome', component: Welcome }
      ]
    }
  ]
})
