// 插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  // 添加实例方法
  Vue.prototype.$http = axios
  // 配置请求的根路径
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
}

export default MyHttpServer
