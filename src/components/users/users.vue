<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <!-- 首页/用户管理/用户列表 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-row class="searchRow">
            <el-col>
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="inputSearch" clearable @clear="handleGetUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="handleGetUserList()"></el-button>
                    </el-input>
                    <el-button type="success" @click="dialogFormVisibleAdd=true">添加用户</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <!-- border为表格渲染边框 -->
        <el-table :data="userlist" border style="width: 100%;margin-top: 20px;">
            <el-table-column label="#" type="index" ></el-table-column>
            <el-table-column prop="username" label="姓名" width="100"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
            <el-table-column label="创建日期" width="220">
              <template slot-scope="userlist">{{userlist.row.create_time | fmtdate}}</template>
              </el-table-column>
            <el-table-column label="用户状态" width="180">
              <template slot-scope="userlist">
                <el-switch v-model="userlist.row.mg_state" @change="changeMgState(userlist.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle plain size="mini"  @click="showEditUserMsg(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="showDelUserMsg(scope.row.id)"></el-button>
              <el-button type="success" icon="el-icon-check" circle plain size="mini" @click="showSetUserRoleMsg(scope.row)"></el-button>
              </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="margin-top:20px;"
            hide-on-single-page
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd" @close="addDialogClosed()">
          <el-form :model="form" :rules="formRules" ref="formRef">
            <el-form-item label="用户名" label-width="100px" prop="username">
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px" prop="password">
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit" @close="editDialogClosed()">
          <el-form :model="form">
            <el-form-item label="用户名" label-width="100px" prop="username">
              <el-input v-model="form.username" disabled autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px" prop="email">
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editUser()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 分配用户角色的对话框 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
          <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
              {{currUserName}}
            </el-form-item>
            <el-form-item label="角色" label-width="100px">
              <el-select v-model="currRoleId">
                <el-option label="请选择" :value="currRoleId"></el-option>
                <el-option :label="item.roleName" :value="item.id" v-for="(item,index) in roles" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
            <el-button type="primary" @click="setRole()">确 定</el-button>
          </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default{
  data () {
    // 验证邮箱规则
    let checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法的邮箱!'))
    }
    // 验证手机号规则
    let checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入合法的手机号!'))
    }
    return {
      currUserId: -1,
      roles: [],
      currUserName: '',
      currRoleId: -1,
      formRules: {// 添加表单的验证规则对象
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '用户名的长度必须在3~10个字符之间', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}
        ],
        mobile: [{ validator: checkMobile, trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      },
      form: {// 添加用户的表单数据
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      dialogFormVisibleAdd: false, // 添加用户对话框的显示与隐藏
      dialogFormVisibleEdit: false, // 修改用户对话框的显示与隐藏
      dialogFormVisibleRole: false, // 用户角色对话框的显示与隐藏
      total: 0, // 总条数
      queryInfo: {
        query: '', // 查询条件
        pagenum: 1, // 当前页码
        pagesize: 5// 每页显示数量
      },
      userlist: []// 用户列表
    }
  },
  mounted () {
    this.handleGetUserList()
  },
  methods: {
    // 用户请求的列表
    async handleGetUserList () {
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      let {data: res} = await this.$http.get(`users`, {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    handleSizeChange (val) { // val=pagesize 处理每页显示数量改变时触发的事件
      this.queryInfo.pagesize = val
      this.handleGetUserList()
    },
    handleCurrentChange (val) { // val=pagenum 处理当前页改变时触发的事件
      this.queryInfo.pagenum = val
      this.handleGetUserList()
    },
    addDialogClosed () { // 关闭添加对话框时触发的事件
      this.$refs.formRef.resetFields()// 清空表单的数据
    },
    addUser () { // 添加用户方法
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        let {data: res} = await this.$http.post(`users`, this.form)
        if (res.meta.status !== 201) return this.$message.warning(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogFormVisibleAdd = false
        this.handleGetUserList() // 重新获取用户列表数据
      })
    },
    showDelUserMsg (userId) { // 删除用户 使用作用域插槽获取对应要删除的用户id
      this.$confirm('是否要删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let {data: res} = await this.$http.delete(`users/${userId}`)
        if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.queryInfo.pagenum = 1
        this.handleGetUserList()
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    showEditUserMsg (user) {
      this.dialogFormVisibleEdit = true
      this.form = user
    },
    async editUser () { // 修改用户
      let {data: res} = await this.$http.put(`users/${this.form.id}`, this.form)
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.dialogFormVisibleEdit = false
      this.handleGetUserList() // 重新获取用户列表数据
    },
    editDialogClosed () { // 关闭修改对话框时触发的事件
      this.form = {}
    },
    async changeMgState (user) { // 修改switch开关用户的状态
      let {data: res} = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.handleGetUserList() // 重新获取用户列表数据
    },
    async showSetUserRoleMsg (user) {
      let {data} = await this.$http.get(`roles`)
      this.roles = data.data
      // 获取当前用户的角色id
      let {data: res} = await this.$http.get(`users/${user.id}`)
      this.currUserId = user.id
      this.currRoleId = res.data.rid
      this.dialogFormVisibleRole = true
      this.currUserName = user.username
    },
    async setRole () {
      let {data: res} = await this.$http.put(`users/${this.currUserId}/role`, {rid: this.currRoleId})
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.dialogFormVisibleRole = false
    }
  }
}
</script>

<style scoped>
.box-card{
    height: 100%;
}
.inputSearch{
    width: 350px;
}
.searchRow{
    margin-top: 20px;
}
</style>
