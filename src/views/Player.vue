<template>
  <div class="player">
    <div class="inner" ref="inner" @animationend="onAnimationendHandler" @mousemove="onMousemoveHandler($event)">
      <!-- 信息栏 -->
      <transition name="infoBar">
        <div class="info-bar" v-show="showInfoBar">
          <h2 class="name">{{ player.songInfo.name }}</h2>
          <span class="singer">{{ player.songInfo.singer }}</span>
          <button class="go-back el-icon-back" @click="$router.push('song')"></button>
        </div>
      </transition>

      <transition name="bottom">
        <div class="bottom" ref="bottom" v-show="showBottom">
          <!-- 歌词栏 -->
          <div class="lrc-bar">
            <lrc></lrc>
          </div>

          <!-- 进度 -->
          <play-progress class="progress"></play-progress>

          <!-- 控制栏 -->
          <div class="control-bar">
            <div class="control-left">
              <span class="duration">{{ player.currentTime | formatTime }} / {{ player.duration | formatTime }}</span>
            </div>

            <div class="control-center">
              <!-- 播放模式 -->
              <play-model></play-model>
              <!-- 上一首 -->
              <div class="icon-box" @click="prev">
                <button class="app app_shangyishou"></button>
              </div>
              <!-- 播放 -->
              <div class="icon-box large" v-show="player.paused" @click="play">
                <button class="app app_bofang1"></button>
              </div>
              <!-- 暂停 -->
              <div class="icon-box large" v-show="!player.paused" @click="pause">
                <button class="app app_zanting"></button>
              </div>
              <!-- 下一首 -->
              <div class="icon-box" @click="next">
                <button class="app app_xiayishou"></button>
              </div>
              <!-- 音量控制 -->
              <volume></volume>
            </div>

            <div class="control-right">
              <!-- 评论 -->
              <div class="icon-box" @click="showComment = true">
                <button class="app app_pinglun"></button>
              </div>
              <!-- 播放列表 -->
              <div class="icon-box" @click="showPlayList = true">
                <button class="app app_yinleliebiao"></button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 播放列表 -->
    <el-drawer
      title="播放列表"
      :visible.sync="showPlayList"
      append-to-body
      destroy-on-close
    >
      <play-list-item-in-player
        v-for="song of player.playList"
        :key="song.id"
        :id="song.id"
        :name="song.name"
        :singer="song.singer"
        :duration="song.duration"
      ></play-list-item-in-player>
    </el-drawer>

    <!-- 评论 -->
    <el-drawer
      title="评论"
      :visible.sync="showComment"
      append-to-body
      destroy-on-close
    >
      <comment></comment>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import playModel from 'cpn/PlayModel.vue'
import playProgress from 'cpn/PlayProgress.vue'
import volume from 'cpn/Volume.vue'
import playListItemInPlayer from 'cpn/PlayListItemInPlayer.vue'
import lrc from 'cpn/Lrc.vue'
import comment from 'cpn/Comment.vue'
export default {
  data () {
    return {
      showInfoBar: false,
      showBottom: false,
      timer: null,
      infoBarElement: null,
      progressElement: null,
      controlBarElement: null,
      showPlayList: false,
      showComment: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.player
    })
  },
  methods: {
    ...mapMutations({
      pause: 'player/pause'
    }),
    ...mapActions({
      play: 'player/play',
      next: 'player/next',
      prev: 'player/prev'
    }),
    onAnimationendHandler () {
      this.showInfoBar = true
      this.showBottom = true
    },
    onMousemoveHandler (event) {
      const target = event.target
      if (
        (this.infoBarElement.contains(target) || this.infoBarElement === target) ||
        (this.progressElement.contains(target) || this.progressElement === target) ||
        (this.controlBarElement.contains(target) || this.controlBarElement === target)
      ) {
        clearTimeout(this.timer)
      } else {
        clearTimeout(this.timer)
        this.$refs.inner.style.cursor = 'default'
        this.showInfoBar = true
        this.$refs.bottom.style.transform = 'translateY(0)'
        this.timer = setTimeout(() => {
          this.$refs.inner.style.cursor = 'none'
          this.showInfoBar = false
          this.$refs.bottom.style.transform = 'translateY(70px)'
        }, 2000)
      }
    }
  },
  filters: {
    formatTime (time) {
      const min = Math.floor(time / 60)
      const sec = Math.floor(time % 60)

      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }
  },
  components: {
    playModel,
    playProgress,
    volume,
    playListItemInPlayer,
    lrc,
    comment
  },
  mounted () {
    this.infoBarElement = document.querySelector('.info-bar')
    this.progressElement = document.querySelector('.progress')
    this.controlBarElement = document.querySelector('.control-bar')
  }
}
</script>

<style scoped>
.player {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  min-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.inner {
  position: relative;
  background-image: url('http://qq.file.lockezk.cn/img/player-bgi.jpg');
  background-size: 100% 100%;
  animation: into .3s linear;
  animation-fill-mode: forwards;
}
.info-bar {
  width: 100%;
  height: 70px;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: transform .3s linear;
}
.lrc-bar {
  width: 100%;
  height: 90px;
  transform: translateY(0);
  transition: transform .3s linear;
}
.control-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 2021;
}
@keyframes into {
  0% {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  99% {
    border-radius: 50%;
  }
  100% {
    border-radius: 0;
    width: 100%;
    height: 100%;
  }
}
.infoBar-enter,
.infoBar-leave-to {
  transform: translateY(-70px);
}
.infoBar-enter-active,
.infoBar-leave-active {
  transition: transform .3s linear;
}
.bottom-enter,
.bottom-leave-to {
  transform: translateY(160px);
}
.bottom-enter-active,
.bottom-leave-active {
  transition: transform .3s linear;
}
.info-bar {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}
.name {
  text-align: center;
  font-size: 14px;
  color: #fff;
  font-weight: 400;
}
.singer {
  text-align: center;
  display: inline-block;
  width: 100%;
  font-size: 12px;
  margin-top: 4px;
  color: var(--secondaryColor);
}
.go-back {
  position: absolute;
  left: 20px;
  bottom: 14px;
  color: #fff;
  font-size: 22px;
}
.go-back:hover {
  color: var(--themeColor);
}
.duration {
  color: #fff;
}
.control-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}
.control-right {
  position: absolute;
  right: 20px;
  display: flex;
}
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.icon-box button {
  color: #fff;
  font-size: 18px;
}
.icon-box:hover button {
  color: var(--themeColor);
}
.icon-box:active button {
  filter: brightness(1.2);
}
.icon-box.large button {
  font-size: 30px;
}
.icon-box + .icon-box {
  margin-left: 10px;
}
</style>
