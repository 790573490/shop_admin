import Vue from 'vue'
import Router from 'vue-router'
// 导入 login文件 不要添加.vue后缀
import Login from '@/components/login/Login'
// 导入 首页组件
import Home from '@/components/home/Home'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
