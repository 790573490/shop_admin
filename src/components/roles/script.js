export default {
  data() {
    return {
      rolesList: [],
      roleEditDialog: false,
      roleEditForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },
      formLabelWidth: '120px',
      rightDialog: false,
      // 所有的权限树形数据
      allRightTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前分配角色权限的id
      curRoleId: -1
    }
  },
  created() {
    this.getRolesList()
    this.getAllRightsTree()
  },
  methods: {
    // 获取所有的权限，将数据展示到页面
    async getAllRightsTree() {
      const res = await this.$http.get(`/rights/tree`)
      // console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.allRightTree = data
      }
    },
    async getRolesList() {
      const res = await this.$http.get('/roles')
      // console.log(res)
      const { meta, data } = res.data
      // console.log(data)
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    /**
     * 根据id删除角色
     * @param {number} id
     */
    delRoles(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${id}`)
          // console.log(res)
          if (res.data.meta.status === 200) {
            const index = this.rolesList.findIndex(item => item.id === id)
            this.rolesList.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showRolesEdit(curRole) {
      this.roleEditDialog = true
      for (const key in curRole) {
        this.roleEditForm[key] = curRole[key]
      }
    },
    async editRole() {
      const { id, roleName, roleDesc } = this.roleEditForm
      const res = await this.$http.put(`roles/${id}`, {
        roleName,
        roleDesc
      })
      // console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.roleEditDialog = false
        // 更新数据
        const editRole = this.rolesList.find(item => item.id === id)
        editRole.roleName = data.roleName
        editRole.roleDesc = data.roleDesc
      }
    },
    /**
     * 删除指定角色的权限
     * @param {number} roleId 角色ID
     * @param {number} rightId 权限ID
     */
    async delRoleRight(roleId, rightId) {
      // console.log(roleId, rightId)
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      console.log(res)
      const { meta, data } = res.data
      if (meta.status === 200) {
        const curRole = this.rolesList.find(item => item.id === roleId)
        curRole.children = data
      }
    },
    // 打开分配权限的弹框
    showRightDialog(curRoleRights, id) {
      this.rightDialog = true
      // 暂存当前角色id
      this.curRoleId = id
      this.$nextTick(() => {
        const level3Ids = []
        curRoleRights.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        // 指定选中id的数组
        this.$refs.rightsTree.setCheckedKeys(level3Ids)
      })
    },
    // 给角色分配权限
    async assignRihts() {
      // 获取到当前角色的选择项的id值
      // 获取全选中项
      const CheckedKeys = this.$refs.rightsTree.getCheckedKeys()
      // 获取半选中项
      const halfCheckedKeys = this.$refs.rightsTree.getHalfCheckedKeys()
      const allCheckedIds = [...CheckedKeys, ...halfCheckedKeys]
      // console.log(allCheckedIds)
      const res = await this.$http.post(`roles/${this.curRoleId}/rights`, {
        rids: allCheckedIds.join(',')
      })
      const { meta, data } = res.data
      if (meta.status === 200) {
        console.log(data)
        this.rightDialog = false
        // 注意需要重新更新下数据列表
        this.getRolesList()
      }
    }
  }
}
