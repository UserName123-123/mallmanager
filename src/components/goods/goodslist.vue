<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchRow" :gutter="20">
        <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList()">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="success" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodslist" border style="width: 100%;margin-top: 20px;">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="140px">
            <template slot-scope="goodslist">
                {{goodslist.row.add_time | fmtdate}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="showEditUserMsg(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination style="margin-top:20px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
    </el-pagination>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      total: 0, // 总条数
      goodslist: [], // 商品列表
      queryInfo: { // 查询参数对象
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList () {
      let {
        data: res
      } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    removeById (goodsId) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let {
          data: res
        } = await this.$http.delete(`goods/${goodsId}`)
        if (res.meta.status !== 200) return this.$message.warning(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.queryInfo.pagenum = 1
        this.getGoodsList()
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style scoped>
.searchRow {
    margin-top: 20px;
}
</style>
