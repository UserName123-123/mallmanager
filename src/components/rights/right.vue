<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/权限管理/权限列表 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-table :data="rightlist" border style="width: 100%;margin-top:30px;" height="578px">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="400"></el-table-column>
        <el-table-column prop="path" label="路径" width="400"></el-table-column>
        <el-table-column prop="level" label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.level==='0'"><el-tag type="success">一级分类</el-tag></span>
                <span v-if="scope.row.level==='1'"><el-tag type="primary">二级分类</el-tag></span>
                <span v-if="scope.row.level==='2'"><el-tag type="warning">三级分类</el-tag></span>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      rightlist: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      let {
        data: res
      } = await this.$http.get(`rights/list`)
      this.rightlist = res.data
    }
  }
}
</script>

<style scoped>

</style>
