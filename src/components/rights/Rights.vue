<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="use-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList" stripe style="width: 100%">
      <!-- 添加index 表示给表格添加索引号 -->
      <el-table-column type="index" width="100">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.level}}</span> -->
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      async getRightsList() {
        const res = await this.$http.get('/rights/list')
        const { meta, data } = res.data
        if (meta.status === 200) {
          this.rightsList = data
        }
      }
    }
  }
</script>

<style scoped>
  .use-breadcrumb {
    line-height: 40px;
    padding-left: 10px;
    background-color: #d8d8d8;
    margin-bottom: 10px;
  }
</style>
