import Vue from 'vue'
import App from './App'
import router from './router'

// 导入全局样式
import '@/assets/index.css'
// 导入element -js
import ElementUI from 'element-ui'
// 导入element -css
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios
import axios from 'axios'
// 配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// axios 请求拦截器
axios.interceptors.request.use(function(config) {
  if (!config.url.endsWith('/login')) {
    config.headers['Authorization'] = localStorage.getItem('token')
  }
  // console.log(config)
  return config
})

// axios 响应拦截器
axios.interceptors.response.use(function(response) {
  if (response.data.meta.status === 401) {
    router.push('/login')
    localStorage.removeItem('token')
  }
  return response
})

// 将 axios 添加到Vue的实例原型中
// 实例对象可以直接使用原型对象中的属性和方法
// 所有组件都是Vue的实例
// 只要是axios 这样的第三方库(与Vue没任何关系)，都应该通过这种方式统一引入
Vue.prototype.$http = axios

// 安装插件
Vue.use(ElementUI)
// 关闭vue的控制台提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
