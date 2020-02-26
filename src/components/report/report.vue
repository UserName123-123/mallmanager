<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <my-bread level1="数据报表" level2="数据统计"></my-bread>
    <div id="main" style="width:600px;height:400px;"></div>
</el-card>
</template>

<script>
let myEchart = require('echarts')
export default {
  data () {
    return {}
  },
  mounted () {
    this.useEchart()
  },
  methods: {
    async useEchart () {
      let myChart = myEchart.init(document.getElementById('main'))
      let {
        data: res
      } = await this.$http.get(`reports/type/1`)
      let option1 = res.data
      let option2 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      let option = {
        ...option1,
        ...option2
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
