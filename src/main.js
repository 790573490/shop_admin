import Vue from 'vue'
import App from './App'
import router from './router'

// 导入全局样式
import '@/assets/index.css'
// 导入element -js
import ElementUI from 'element-ui'
// 导入element -css
import 'element-ui/lib/theme-chalk/index.css'
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
