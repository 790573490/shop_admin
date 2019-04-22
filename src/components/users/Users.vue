<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="use-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入查询的用户名" v-model="queryStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryUseList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="showUserAddDialog">添加</el-button>
      </el-col>
    </el-row>
    <!--
      el-table 表格组件
      :data 绑定数据
      stripe 隔行换色
      el-table-column 表格每一项
      label 每一列的标题名称
      width 每一列宽度
      prop 表示数据中的属性名
    -->
    <el-table :data="userList" stripe class="use-table">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="200">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserStatus(scope.row.id, scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="showUserEditDailog(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
          <el-button @click="delUserById(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
          <el-button size="mini" type="warning" icon="el-icon-check" plain @click="showUserAssignDialog">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :current-page.sync 可以设置为当前页 -->
    <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="currentPage" @current-change="changePage"></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="收货地址" width="30%" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userAddFrom" :rules="userAddRules" ref="loginForm">
        <div class="user-m">
          <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
            <el-input v-model="userAddFrom.username"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
            <el-input v-model="userAddFrom.password"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="userAddFrom.email"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
            <el-input v-model="userAddFrom.mobile"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" width="30%" :visible.sync="userEditDialog" @close="closeUserEditDialog">
      <el-form :model="userEditFrom" :rules="userEditRules" ref="userEditFrom">
        <div class="user-m">
          <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
            <el-input :disabled="true" :value="userEditFrom.username"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="userEditFrom.email"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="电话" :label-width="formLabelWidth">
            <el-input v-model="userEditFrom.mobile"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="userAssignDialog">
      <el-form :model="userAssignForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userAssignForm.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth">
          <el-select v-model="userAssignForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="userAssignDialog = false">确 定</el-button>
      </div>
    </el-dialog>
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
        userList: [],
        pageSize: 2,
        currentPage: 1,
        total: 0,
        queryStr: '',
        userAddDialog: false,
        userAddFrom: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        formLabelWidth: '120px',
        userAddRules: {
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
        },
        userEditDialog: false,
        userEditFrom: {
          id: -1,
          username: '',
          email: '',
          mobile: ''
        },
        userEditRules: {
          mobile: [
            {
              pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
              message: '手机号码格式不正确',
              // 当前值改变，就会触发验证  如果两个都用写法 'change, blur'
              trigger: 'change'
            }
          ]
        },
        userAssignDialog: false,
        userAssignForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      // 获取用户列表，渲染页面
      getUserList(currentPage = 1) {
        this.$http
          .get('/users', {
            params: {
              pagenum: currentPage,
              pagesize: 2,
              query: this.queryStr || ''
            }
            // headers: { Authorization: localStorage.getItem('token') }
          })
          .then(res => {
            console.log(res)
            const { data, meta } = res.data
            if (meta.status === 200) {
              this.userList = data.users
              this.total = data.total
              this.currentPage = data.pagenum
            }
          })
      },
      // 分页
      changePage(currentPage) {
        this.getUserList(currentPage)
      },
      // 用户搜索功能
      queryUseList() {
        console.log(this.queryStr)
        this.currentPage = 1
        this.getUserList()
      },
      // 时间补零操作
      buLing(x) {
        if (x < 10) {
          x = '0' + x
        }
        return x
      },
      // 用户启用功能
      changeUserStatus(id, curStatus) {
        this.$http.put(`users/${id}/state/${curStatus}`).then(res => {
          const { data, meta } = res.data
          if (meta.status === 200) {
            let time = new Date()
            time = new Date()
            let y = time.getFullYear()
            let m = time.getMonth() + 1
            let d = time.getDate()
            let H = time.getHours()
            let M = time.getMinutes()
            let S = time.getSeconds()
            m = this.buLing(m)
            d = this.buLing(d)
            H = this.buLing(H)
            M = this.buLing(M)
            S = this.buLing(S)
            time = y + '-' + m + '-' + d + ' ' + H + ':' + M + ':' + S
            this.$message({
              type: data.mg_state === 0 ? 'warning' : 'success',
              message:
                data.mg_state === 0
                  ? `禁用成功! 操作时间${time}`
                  : `启用成功! 操作时间${time}`,
              duration: 2000
            })
          } else {
            this.$message({
              type: 'error',
              message: meta.msg,
              duration: 2000
            })
          }
        })
      },
      // 展示模态框
      showUserAddDialog() {
        this.userAddDialog = true
      },
      // 添加新用户
      addUser() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            console.log('验证成功')
            this.$http.post('/users', this.userAddFrom).then(res => {
              console.log(res)
              // 关闭对话框
              const { meta } = res.data
              if (meta.status === 201) {
                this.userAddDialog = false
                this.getUserList()
              }
              // 重置表单
              // 重新获取表单数据 渲染页面
            })
          } else {
            console.log('验证失败')
            return false
          }
        })
      },
      // 关闭模态框的回调函数
      closeUserAddDialog() {
        this.$refs.loginForm.resetFields()
      },
      // 删除用户
      delUserById(id) {
        this.$confirm('确定删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http.delete(`users/${id}`).then(res => {
              // console.log(res)
              const { meta } = res.data
              if (meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: meta.msg
                })
                // 此方法刷新
                this.getUserList(this.currentPage)
                // 此方法只有当前页不足2条时刷新
                // const index = this.userList.findIndex(item => item.id === id)
                // this.userList.splice(index, 1)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 打开编辑框
      showUserEditDailog(curUser) {
        // console.log(curUser)
        for (const key in this.userEditFrom) {
          this.userEditFrom[key] = curUser[key]
        }
        this.userEditDialog = true
      },
      // 关闭编辑框的回调函数
      closeUserEditDialog() {},
      // 提交编辑用户信息
      editUser() {
        this.$refs.userEditFrom.validate(valid => {
          if (valid) {
            const { id, email, mobile } = this.userEditFrom
            // console.log(id)
            this.$http
              .put(`/users/${id}`, {
                email: email,
                mobile: mobile
              })
              .then(res => {
                // console.log(res)
                const { data, meta } = res.data
                if (meta.status === 200) {
                  const itemUser = this.userList.find(item => item.id === data.id)
                  itemUser.email = data.email
                  itemUser.mobile = data.mobile
                  this.userEditDialog = false
                }
              })
          } else {
            console.log('验证失败')
          }
        })
      },
      // 展示用户分配角色对话框
      showUserAssignDialog() {
        this.userAssignDialog = true
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
  .user-m {
    margin-right: 55px;
  }
</style>
