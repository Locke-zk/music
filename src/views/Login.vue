<template>
  <div class="login">
    <el-form
      :model="loginModel"
      label-width="100px"
      label-position="right"
      @keydown.native.enter="login"
      v-if="!isLogin"
    >
      <!-- 账号 -->
      <el-form-item
        label="账号"
        prop="account"
        :rules="[
          { required: true, message: '账号不能为空' }
        ]"
      >
        <el-input
          type="text"
          v-model="loginModel.account"
          clearable
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item
        label="密码"
        prop="password"
        :rules="[
          { required: true, message: '密码不能为空' }
        ]"
      >
        <el-input
          type="password"
          v-model="loginModel.password"
          clearable
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!Boolean(loginModel.account && loginModel.password)"
          @click="login"
        >登录</el-button>
        <span style="margin-left: 20px; font-size: 12px; color: #333">新用户自动注册</span>
      </el-form-item>
    </el-form>

    <!-- 用户资料 -->
    <user-info :account="userAccount" v-else :show-exit="true"></user-info>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import userInfo from 'cpn/UserInfo.vue'
export default {
  data () {
    return {
      loginModel: {
        account: '',
        password: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.account.isLogin,
      userAccount: state => state.account.userInfo.account
    })
  },
  components: {
    userInfo
  },
  methods: {
    ...mapMutations({
      updateUserInfo: 'account/updateUserInfo',
      updateLogin: 'account/updateLogin'
    }),
    login () {
      if (!(this.loginModel.account && this.loginModel.password)) return
      this.loading = true
      fetch(this.$api + '/sign-in', {
        method: 'POST',
        body: JSON.stringify(this.loginModel),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => {
        switch (res.state) {
          case 200: {
            document.cookie = `token=${res.token}; max-age=${60 * 60 * 24};`
            // 请求用户信息
            fetch(this.$api + '/user-info', {
              method: 'POST',
              body: JSON.stringify({
                account: this.loginModel.account
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json()).then(res => {
              this.updateUserInfo(res)
              this.updateLogin(true)
              this.loading = false
              this.loginModel.account = ''
              this.loginModel.password = ''
              this.$message({
                message: res.nickname + ' 欢迎你',
                type: 'success'
              })
            })
            break
          }
          case 404: {
            this.$message({
              message: res.message,
              type: 'error'
            })
            break
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  width: 50%;
  margin: 50px auto 0;
}
</style>
