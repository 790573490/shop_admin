<template>
  <div>
    <!--
      el-table 表格组件
      :data 绑定数据
      stripe 隔行换色
      el-table-column 表格每一项
      label 每一列的标题名称
      width 每一列宽度
      prop 表示数据中的属性名
     -->
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
      </el-table-column>
      <el-table-column prop="address" label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    created() {
      // 发送数据获取请求
      this.getUserList()
    },
    data() {
      return {
        userList: []
      }
    },
    methods: {
      getUserList() {
        this.$http
          .get('/users', {
            params: {
              pagenum: 1,
              pagesize: 3
            }
            // headers: { Authorization: localStorage.getItem('token') }
          })
          .then(res => {
            // console.log(res)
            const { data, meta } = res.data
            if (meta.status === 200) {
              this.userList = data.users
            }
          })
      }
    }
  }
</script>

<style>
</style>
