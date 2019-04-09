<template>
  <el-container class="home-wrapper">
    <el-header>
      <el-row>
        <el-col :span="8" class="logo">

          <img class="imgsmat" v-if="isCollapse" src="@/assets/images/smat.jpg" alt="">
          <img class="imgbig" v-else src="@/assets/images/CCTV.jpg" alt="">
          <span class="el-icon-menu" @click="opoo(isCollapse)"></span>
        </el-col>
        <el-col :span="8">
          <h1 class="title">电商后台管理系统</h1>
        </el-col>
        <el-col :span="8">
          <div class="welcome">
            <span>欢迎使用定制管理系统</span>
            <a href="#" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- <el-aside> -->
      <el-menu default-active="/home/users" class="el-menu-vertical-demo" background-color="#001529" text-color="#fff" active-text-color="#ffd04b" @open="handleOpen" :unique-opened="true" :router="true" @close="handleClose" :collapse="isCollapse">
        <el-submenu index="1" class="home-open-menu">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">用户管理</span>
          </template>
          <el-menu-item index="/home/users">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span slot="title">用户列表</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2" class="home-open-menu">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">用户管理</span>
          </template>
          <el-menu-item index="2-1">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span slot="title">用户列表</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- </el-aside> -->
      <el-main>
        <!-- 子路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        isCollapse: false
      }
    },
    methods: {
      opoo(x) {
        this.isCollapse = !x
      },
      logout() {
        // 用户确认的时候，对话框
        // 用户点击确认
        // 2.1返回主页
        // 2.2清除token
        this.$confirm('您将退出本管理系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>

<style scoped lang='less'>
  .home-wrapper {
    height: 100%;

    .el-header {
      background-color: #001529;
      color: #b8b8b8;
      text-align: center;
      padding: 0;
      .logo {
        text-align: left;
        span {
          position: absolute;
          top: 17px;
          cursor: pointer;
          font-size: 23px;
          color: #3379db;
        }
        .imgsmat {
          width: 46px;
          height: 46px;
          padding-top: 5px;
          padding-left: 10px;
        }
        .imgbig {
          width: 156px;
          height: 42px;
          padding-top: 5px;
          padding-left: 10px;
        }
      }
      .title {
        margin: 0;
        line-height: 60px;
        font-size: 30px;
        color: #6c7393;
      }
      .welcome {
        text-align: right;
        line-height: 60px;
        font-weight: bold;
        padding-right: 50px;
        a {
          color: #b07a17;
          text-decoration: none;
        }
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }

    .el-main {
      background-color: #eaeef1;
      color: #333;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
      line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
      line-height: 320px;
    }
  }
</style>
