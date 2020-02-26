<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/权限管理/角色列表 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrolebtn">
        <el-col>
            <el-button type="success">添加角色</el-button>
        </el-col>
    </el-row>
    <el-table :data="rolelist" border style="width: 100%;margin-top: 20px;">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <span v-if="scope.row.children.length===0">未分配权限</span>
                <el-row v-for="(item1,index) in scope.row.children" :key="index" :class="['bdbottom',index===0?'bdtop':'','vcenter']">
                    <el-col :span="4">
                        <el-tag @close="deleRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="(item2,index) in item1.children" :key="index" :class="[index===0?'':'bdtop','vcenter']">
                            <el-col :span="4">
                                <el-tag @close="deleRight(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning" v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="250"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="showEditRightDia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="showDelRightDia(scope.row.id)"></el-button>
                <el-button type="success" icon="el-icon-check" circle plain size="mini" @click="showSetRightDia(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
        <!-- 树形结构 -->
        <el-tree :data="treelist" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrcheck" :props="defaultProps" ref="tree">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
            <el-button type="primary" @click="setRoleRight()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      currRoleId: -1, // 当前要修改权限的用户id
      arrcheck: [], // 默认选中的值得id数组
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      dialogFormVisibleRight: false,
      rolelist: [],
      treelist: []
    }
  },
  created () {
    this.getRightRoleList()
  },
  methods: {
    // 取消权限
    async deleRight (role, rightId) {
      let {
        data: res
      } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data // 删除之后会返回剩余权限所以讲所点击的角色的children重新赋值
    },
    async getRightRoleList () { // 获取角色列表
      let {
        data: res
      } = await this.$http.get(`roles`)
      this.rolelist = res.data
    },
    async showSetRightDia (role) { // 打开修改权限的对话框
      this.dialogFormVisibleRight = true
      let {
        data: res
      } = await this.$http.get(`rights/tree`)
      this.currRoleId = role.id
      this.treelist = res.data
      let arrtemp1 = []
      role.children.forEach((item1) => {
        // arrtemp1.push(item1.id)
        item1.children.forEach((item2) => {
          // arrtemp1.push(item2.id)
          item2.children.forEach((item3) => {
            arrtemp1.push(item3.id)
          })
        })
      })
      this.arrcheck = arrtemp1
    },
    showEditRightDia (role) { // 打开修改角色的对话框

    },
    showDelRightDia (id) { // 打开删除角色的对话框

    },
    async setRoleRight () { // 修改权限
      let arr1 = this.$refs.tree.getCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      let arr = [...arr1, ...arr2]
      let {
        data: res
      } = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.dialogFormVisibleRight = false
      this.getRightRoleList()
    }
  }
}
</script>

<style scoped>
.addrolebtn {
    margin-top: 25px;
    ;
}

.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
