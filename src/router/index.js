import Vue from 'vue'
import Router from 'vue-router'
// 导入 login文件 不要添加.vue后缀
import Login from '@/components/login/Login'
// 导入 首页组件
import Home from '@/components/home/Home'
// 导入 user 组件
import Users from '@/components/users/Users'
// 导入 rights 组件
import Rights from '@/components/rights/Rights'
// 导入 roles 组件
import Roles from '@/components/roles/Roles'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles }
      ]
    }
  ]
})
// 登录拦截，导航守卫的使用
router.beforeEach((to, from, next) => {
  // next('/login')
  // console.log(to, from)
  if (to.path === '/login') {
    // 直接调用next方法，访问的是哪个页面，就展示哪个页面的内容
    next()
  } else {
    // 当用户没有登录直接拦截到login中
    // 通过登录成功时候保存的token，来作为有没有登录成功的条件
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
