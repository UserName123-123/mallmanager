// 插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 添加实例方法
  Vue.prototype.$http = axios
  // 配置请求的根路径
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  // 添加请求拦截器
  axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    if (config.url !== 'login') config.headers['Authorization'] = sessionStorage.getItem('token')
    return config
  }, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
}

export default MyHttpServer
