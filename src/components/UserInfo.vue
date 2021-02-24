<template>
  <div class="user-info">
    <ul class="panel" v-loading="loading" v-if="!showEdit">
      <!-- 头像 -->
      <li class="panel-item">
        <label>头像</label>
        <div class="avatar">
          <!-- 大图预览 -->
          <el-image
            style="width: 60px; height: 60px; border-radius: 50%"
            :src="userInfo.avatar"
            :preview-src-list="[userInfo.avatar]"
            :z-index="2021"
          ></el-image>
        </div>
      </li>
      <!-- 昵称 -->
      <li class="panel-item">
        <label>昵称</label>
        <span>{{ userInfo.nickname }}</span>
      </li>
      <!-- 账号 -->
      <li class="panel-item">
        <label>账号</label>
        <span>{{ userInfo.account }}</span>
      </li>
      <!-- 性别 -->
      <li class="panel-item">
        <label>性别</label>
        <span>{{ userInfo.gender }}</span>
      </li>
      <!-- 个签 -->
      <li class="introduction panel-item">
        <label>个签</label>
        <span>{{ userInfo.introduction }}</span>
      </li>
      <!-- 按钮 -->
      <li class="btns panel-item">
        <el-button type="primary" v-if="showEditButton" @click="showEdit = true">编辑资料</el-button>
        <el-button v-if="showExit" @click="exitAccount">退出</el-button>
        <el-button v-if="showBack" @click="$emit('close')">返回</el-button>
      </li>
    </ul>

    <!-- 编辑资料 -->
    <edit-user-info :user-info="userInfo" v-else @close="showEdit = false"></edit-user-info>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import editUserInfo from 'cpn/Edit.vue'
export default {
  props: [
    'account',
    'showBack',
    'showExit'
  ],
  data () {
    return {
      userInfo: {
        id: 0,
        account: '',
        gender: '',
        introduction: '',
        nickname: '',
        avatar: require('img/square.png')
      },
      loading: false,
      showEdit: false
    }
  },
  components: {
    editUserInfo
  },
  computed: {
    ...mapState({
      loginUserId: state => state.account.userInfo.id
    }),
    showEditButton () {
      return this.loginUserId === this.userInfo.id
    }
  },
  methods: {
    ...mapMutations({
      exitAccount: 'account/exit'
    }),
    getUserInfo () {
      this.userInfo = {
        id: 0,
        account: '',
        gender: '',
        introduction: '',
        nickname: '',
        avatar: require('img/square.png')
      }
      this.loading = true
      fetch(this.$api + '/user-info', {
        method: 'POST',
        body: JSON.stringify({
          account: this.account
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => {
        this.userInfo = res
        this.loading = false
      })
    }
  },
  watch: {
    showEdit: {
      handler () {
        if (!this.showEdit) {
          this.getUserInfo()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.panel-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}
.panel-item label {
  width: 60px;
  text-align: right;
}
.introduction span {
  display: inline-block;
  width: 500px;
  text-align: right;
}
.btns {
  justify-content: space-around !important;
  padding-top: 30px !important;
}
</style>
