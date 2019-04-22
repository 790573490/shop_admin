<template>
  <div class="login-wrapper">
    <el-row type="flex" class="login-form" justify="center" align="middle">
      <el-col :xs="12" :sm="10" :md="8" :lg="6" class="login-center">
        <el-form :model="loginForm" label-position="top" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            // required 必填项 改为false 前面小星星就没了
            // message 当前校验规则提示语
            // trigger 表示触发方式，blur:失去焦点时
            { required: true, message: '用户名必填项', trigger: 'blur' },
            {
              min: 3,
              max: 6,
              message: '用户名长度在 3 到 6 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            { required: true, message: '密码为必填项', trigger: 'blur' },
            {
              min: 3,
              max: 6,
              message: '密码长度在 3 到 6 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 登录功能的实现
      async login() {
        // 使用axuis 发送请求
        // http://localhost:8888/api/private/v1/login
        const res = await axios.post('/login', this.loginForm)
        console.log(res)
        const { data, meta } = res.data
        // console.log(data)
        if (meta.status === 200) {
          // 将登录成功的表示存到 localStorage中
          localStorage.setItem('token', data.token)
          // console.log('登录成功')
          // 登录的成功跳转首页
          this.$router.push('home')
        } else {
          this.$message({
            message: meta.msg,
            type: 'error',
            duration: 2000
          })
        }
      },
      submitForm() {
        // this.$refs[formName] 登录按钮
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            // 如果成功，调用登录接口
            // 获取用户名和密码
            this.login()
          } else {
            // 失败什么都不需要做
            return false
          }
        })
      },
      resetForm() {
        this.$refs.loginForm.resetFields()
      }
    }
  }
</script>

<style>
  .login-wrapper {
    background-image: url(../../assets/images/bgc.png);
    background-repeat: no-repeat;
    background-color: #b8e5f8;
    background-size: cover;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .login-wrapper,
  .login-form {
    height: 100%;
  }
  .login-center {
    min-width: 381px;
    padding: 20px 30px;
    border-radius: 10px;
    background-color: #fff;
  }
</style>
