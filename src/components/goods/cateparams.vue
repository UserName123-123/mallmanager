<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/商品管理/商品列表 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="只允许为三级分类设置参数" type="error" style="margin-top:20px;"></el-alert>
    <el-form label-position="left" label-width="80px" style="overflow:auto;margin-top:20px;">
        <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader clearable :show-all-levels="false" v-model="selectedOptions" :options="options" expandTrigger="hover" :props="defaultProp" @change="handleChange"></el-cascader>
        </el-form-item>
    </el-form>
    <el-tabs v-model="active" @tab-click="handleClick()">
        <el-tab-pane label="动态参数" name="1">
            <!-- 按钮 -->
            <el-button type="danger">设置动态参数</el-button>
            <!-- 表格 -->
            <el-table :data="arrDyparams" style="width: 100%">
                <el-table-column type="expand" label="#">
                    <template slot-scope="scope">
                        <!-- el-tag -->
                        <el-tag :key="tag" v-for="tag in scope.row.attr_vals" style="margin-right:7px;" closable :disable-transitions="false" @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)" @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="属性名称" prop="attr_name">
                </el-table-column>
                <el-table-column label="操作" prop="desc">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="showEditUserMsg(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="showDelUserMsg(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
            <!-- 按钮 -->
            <el-button type="danger">设置静态参数</el-button>
            <el-table :data="arrStaticparams" style="width: 100%">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="属性值" prop="attr_vals">
                </el-table-column>
                <el-table-column label="操作" prop="desc">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle plain size="mini" @click="showEditUserMsg(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle plain size="mini" @click="showDelUserMsg(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      list: [],
      active: '1',
      selectedOptions: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      options: [],
      arrDyparams: [],
      arrStaticparams: []
    }
  },
  methods: {
    async handleClose (attrvals, attrid, attrname, tag) { // 点击X按钮时触发
      attrvals.splice(attrvals.indexOf(tag), 1)
      let putData = {
        attr_name: attrname,
        attr_sel: 'many',
        attr_vals: attrvals.join(',')
      }
      let {
        data: res
      } = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attrid}`, putData)
      console.log(res)
    },
    showInput () { // 点击new tag按钮时触发
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (attrvals, attrid, attrname) { // 回车时触发
      let inputValue = this.inputValue
      if (inputValue) {
        attrvals.push(inputValue)
        // 发送请求
        let putData = {
          attr_name: attrname,
          attr_sel: 'many',
          attr_vals: attrvals.join(',')
        }
        let {
          data: res
        } = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attrid}`, putData)
        console.log(res)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    async handleClick () { // tab切换时触发
      if (this.active === '2') {
        if (this.selectedOptions.length === 3) {
          // 获取静态参数数据
          // 获取静态参数的数据
          let {
            data: res
          } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
          this.arrStaticparams = res.data
        }
      }
    },
    async handleChange (val) { // 级联选择器 @change时触发的方法
      if (this.selectedOptions.length === 3) {
        // 获取动态参数
        let {
          data: res
        } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
        this.options = res.data
        // attr_name和attr_vals
        this.arrDyparams = res.data
        this.arrDyparams.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      }
    },
    async getGoodCate () {
      let {
        data: res
      } = await this.$http.get(`categories?type=3`)
      this.options = res.data
    }
  },
  created () {
    this.getGoodCate()
  }
}
</script>

<style scoped>

</style>
