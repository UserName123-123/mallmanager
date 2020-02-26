<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/商品管理/商品列表 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert title="添加商品信息" type="success" center show-icon style="margin-top:20px;">
    </el-alert>
    <!-- 步骤条 el-steps  -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-form label-position="top" label-width="80px" :model="form" style="height:450px;overflow:auto;">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
            <el-tab-pane name="1" label="基本信息">
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <!-- 级联选择器 -->
                    <el-cascader clearable v-model="selectedOptions" :options="options" expandTrigger="hover" :props="defaultProp" @change="handleChange"></el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="2" label="商品参数">
                <el-form-item :label="item.attr_name" v-for="(item,index) in arrDyparams" :key="index">
                    <!-- 复选框组 -->
                    <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="item1" v-for="(item1,index) in item.attr_vals" :key="index" border></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品属性">
                <!-- 静态参数的数据 -->
                <el-form-item :label="item.attr_name" v-for="(item,index) in arrStaticparams" :key="index">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品图片">
                <el-form-item>
                    <el-upload style="margin-top:20px" :headers="headers" action="http://127.0.0.1:8888/api/private/v1/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="5" label="商品内容" style="margin-top:20px">
                <el-form-item>
                    <!-- 表单元素 -->
                    <el-button type="primary" @click="addGoods()">点我-添加商品</el-button>
                    <!-- 富文本 -->
                    <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
  quillEditor
} from 'vue-quill-editor'
export default {
  data () {
    return {
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      checkList: [],
      arrStaticparams: [], // 静态参数的数据数组
      arrDyparams: [], // 动态参数的数据数组
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [], // [{pic:图片临时路径}]
        attrs: [] // 商品参数数组
      },
      active: '1'
    }
  },
  methods: {
    async addGoods () { // 添加商品 发送请求
      this.form.goods_cat = this.selectedOptions.join(',')
      let arr1 = this.arrDyparams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_value
        }
      })
      let arr2 = this.arrStaticparams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_value
        }
      })
      this.form.attrs = [...arr1, ...arr2]
      const {
        data: res
      } = await this.$http.post(`goods`, this.form)
      this.$router.push({
        name: 'goods'
      })
      console.log(res.data)
    },
    async tabChange () { // 点击不同的tab时触发函数
      if (this.active === '1') {
        return this.getGoodCate()
      }
      if (this.active === '2') {
        if (this.selectedOptions.length !== 3) {
          return this.$message.warning('请先选择商品的三级分类')
        }
        let {
          data: res
        } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
        this.options = res.data
        // attr_name和attr_vals
        this.arrDyparams = res.data
        this.arrDyparams.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      } else if (this.active === '3') {
        if (this.selectedOptions.length !== 3) {
          return this.$message.warning('请先选择商品的三级分类')
        }
        // 获取静态参数的数据
        let {
          data: res
        } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
        this.arrStaticparams = res.data
      }
    },
    handleChange (val) { // 级联选择器 @change时触发的方法
    },
    async getGoodCate () {
      let {
        data: res
      } = await this.$http.get(`categories?type=3`)
      this.options = res.data
    },
    handleSuccess (file) { // 图片上传成功相关方法 file形参里面是当前操作的图片的相关信息(图片名/图片路径)
      // file.data.tmp_path 图片临时上传的路径
      this.form.pics.push({
        pic: file.data.tmp_path
      })
    },
    handlePreview (file) { // 图片上传的相关方法

    },
    handleRemove (file) { // 图片移除相关方法
      // file.response.data.tmp_path 图片临时上传的路径
      let index = this.form.pics.findIndex(item => { // 获取数组中图片所对应的下标
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(index, 1) // 从数组中删除下表所对应的图片临时路径数据
    }
  },
  created () {
    this.getGoodCate()
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
.ql-editor {
    min-height: 300px;
}
</style>
