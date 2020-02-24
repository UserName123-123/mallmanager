// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import App from './App'
import router from './router'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'
import myBread from '@/components/cuscom/myBread'

Vue.config.productionTip = false

// 使用Vue插件
Vue.use(ElementUI)
Vue.use(MyHttpServer)

// 全局过滤器处理日期格式
Vue.filter('fmtdate', (val) => {
  return moment(val).format('YYYY-MM-HH')
})
Vue.component(myBread.name, myBread)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
