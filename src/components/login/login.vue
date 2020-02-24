<template>
<div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <h2>用户登录</h2>
        <el-form-item label="名称">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" @click.prevent="handleLogin()">登录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
  methods: {
    async handleLogin () {
      let {
        data: res
      } = await this.$http.post('login', this.formdata)
      if (res.meta.status === 200) {
        sessionStorage.setItem('token', res.data.token)
        this.$message.success(res.meta.msg)
        this.$router.push({
          name: 'welcome'
        })
      } else {
        return this.$message.warning(res.meta.msg)
      }
    }
  },
  data () {
    return {
      list: [],
      formdata: {
        username: 'admin',
        password: '123456'
      }
    }
  }
}
</script>

<style scoped>
.login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-wrap .login-form {
    width: 400px;
    background-color: #FFF;
    border-radius: 5px;
    padding: 30px;
}

.login-wrap .login-form .login-btn {
    width: 100%
}
</style>
