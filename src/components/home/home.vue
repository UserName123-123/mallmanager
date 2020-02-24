<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <img src="http://www.itheima.com/images/logo.png" alt="" class="img">
                </div>
            </el-col>
            <el-col :span="22">
                <h3 class="middle">电商后台管理系统</h3>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <a href="#" class="logout" @click.prevent="logout()">退出</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <!-- 侧边栏导航el-menu -->
            <!-- 1 -->
            <el-menu :unique-opened="true" router>
                <el-submenu :index="item.order+''" v-for="(item,index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item :index="items.path" v-for="(items,index) in item.children" :key="index">
                        <i class="el-icon-menu"></i>
                        <span>{{items.authName}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.getMnues()
  },
  methods: {
    async getMnues () { // 获取导航数据
      const {
        data: res
      } = await this.$http.get(`menus`)
      this.menus = res.data
    },
    logout () {
      sessionStorage.clear()
      this.$message.success('退出成功!')
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>
.container {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
    height: 100%;
}

/* 头部样式 */
.middle {
    text-align: center;
}

.logout {
    line-height: 60px;
    text-decoration: none;
}

.img {
    position: absolute;
    left: -20px;
}
</style>
