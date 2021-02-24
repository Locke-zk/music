<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="nav-bar">
      <div class="nav-inner">
        <div class="nav-left">
          <router-link to="/song" class="nav-item">
            <span>曲库</span>
          </router-link>

          <router-link to="/list" class="nav-item">
            <span>播放列表</span>
            <span v-if="player.playList.length">({{ player.playList.length }})</span>
          </router-link>

          <router-link to="/download" class="nav-item">
            <span>下载中心</span>
            <span v-if="downloadTaskNumber">({{ downloadTaskNumber }})</span>
          </router-link>

          <router-link to="/player" class="nav-item">
            <span>播放器</span>
            <i class="app app_ziyuanldpi" style="color: var(--themeColor); margin-left: 10px" v-if="!player.paused"></i>
          </router-link>
        </div>

        <div class="nav-right">
          <router-link to="/login" class="nav-item account">
            <span v-if="!isLogin">登录</span>
            <img :src="userAvatar" class="avatar" v-else>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 内容区 -->
    <div class="content">
      <div class="content-inner">
        <router-view></router-view>
      </div>
    </div>

    <!-- 回顶部 -->
    <el-backtop target=".content"></el-backtop>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      downloadTaskNumber: state => state.download.taskList.length,
      player: state => state.player,
      isLogin: state => state.account.isLogin,
      userAvatar: state => state.account.userInfo.avatar
    })
  },
  methods: {
    ...mapMutations({
      updateUserInfo: 'account/updateUserInfo',
      updateLogin: 'account/updateLogin'
    }),
    ...mapActions({
      initPlayerEvent: 'player/initEvent'
    })
  },
  created () {
    this.initPlayerEvent()
    // 自动登录
    fetch(this.$api + '/authentication', {
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      switch (res.state) {
        case 200: {
          this.updateUserInfo(res.userInfo)
          this.updateLogin(true)
          this.$message({
            message: res.userInfo.nickname + ' 欢迎你',
            type: 'success'
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
</script>

<style scoped>
#app {
  height: 100vh;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}
.nav-left,
.nav-right {
  height: 100%;
}
.nav-item {
  padding: 0 30px;
  height: 70px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
.nav-item:hover {
  color: var(--themeColor);
}
.nav-item:not(.account).router-link-active {
  color: #fff;
  background-color: var(--themeColor);
}
.content {
  width: 100%;
  height: calc(100% - 70px);
  background-color: #F5F5F5;
  overflow-y: auto;
}
.content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
