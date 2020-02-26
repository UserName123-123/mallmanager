<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchRow">
        <el-col>
            <el-button type="primary" @click="addGoodsCate()">添加分类</el-button>
        </el-col>
    </el-row>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLableWidth">
                <el-input v-model="form.cat_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLableWidth">
                <el-cascader change-on-select clearable v-model="selectedOptions" :options="caslist" expand-trigger="hover" :props="defaultProp"></el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd=false">取消</el-button>
            <el-button type="primary" @click="addCate()">确定</el-button>
        </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width:100%">
        <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childrenKey="children"></el-tree-grid>
        <el-table-column label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">
                    <el-tag type="success">一级分类</el-tag>
                </span>
                <span v-if="scope.row.cat_level===1">
                    <el-tag type="primary">二级分类</el-tag>
                </span>
                <span v-if="scope.row.cat_level===2">
                    <el-tag type="warning">三级分类</el-tag>
                </span>
            </template>
        </el-table-column>
        <el-table-column label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination style="margin-top:20px;" hide-on-single-page @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
    </el-pagination>
</el-card>
</template>

<script>
let ElTreeGrid = require('element-tree-grid')
export default {
  components: {
    ElTreeGrid // <el-tree-grid/>
  },
  data () {
    return {
      caslist: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      list: [],
      dialogFormVisibleAdd: false,
      selectedOptions: [],
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      formLableWidth: '120px',
      total: 0, // 总数据条数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    async addCate () {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      }
      let {
        data: res
      } = await this.$http.post(`categories`, this.form)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.dialogFormVisibleAdd = false
      this.form = {}
      this.getGoodsCate()
    },
    async getGoodsCate () { // 获取商品分类数据
      let {
        data: res
      } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.list = res.data.result
      this.total = res.data.total
    },
    async addGoodsCate () { // 添加商品分类
      let {
        data: res
      } = await this.$http.get(`categories?type=2`)
      this.caslist = res.data
      this.dialogFormVisibleAdd = true
    },
    handleSizeChange (val) { // val=pagesize 处理每页显示数量改变时触发的事件
      this.queryInfo.pagesize = val
      this.getGoodsCate()
    },
    handleCurrentChange (val) { // val=pagenum 处理当前页改变时触发的事件
      this.queryInfo.pagenum = val
      this.getGoodsCate()
    }
  }
}
</script>

<style scoped>
.searchRow {
    margin-top: 20px;
}
</style>
