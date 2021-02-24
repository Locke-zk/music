<template>
  <li class="list-item" :class="{ 'is-current': isCurrent }">
    <!-- 序号 -->
    <div class="serial-box">
      <pre class="serial" v-if="!isCurrent">{{ serial }}</pre>
      <i class="app app_ziyuanldpi" style="color: var(--themeColor)" v-else></i>
    </div>
    <!-- 封面 -->
    <img :src="imgSrc" class="cover">
    <!-- 歌名 -->
    <span class="name">{{ name }}</span>
    <!-- 歌手 -->
    <span class="singer">{{ singer }}</span>
    <!-- 时长 -->
    <span class="duration">{{ duration }}</span>
    <!-- 功能 -->
    <ul class="function">
      <el-button size="small" @click="switchSong(id)" v-if="!isPlay">播放</el-button>
      <el-button size="small" @click="pause" v-else>暂停</el-button>
      <el-button size="small" @click="removePlayList(id)">移除</el-button>
    </ul>
  </li>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  props: [
    'id',
    'serial',
    'cover',
    'name',
    'singer',
    'duration'
  ],
  data () {
    return {
      imgSrc: require('img/square.png')
    }
  },
  computed: {
    ...mapState({
      player: state => state.player
    }),
    isCurrent () {
      return this.id === this.player.songInfo.id
    },
    isPlay () {
      return this.isCurrent && !this.player.paused
    }
  },
  methods: {
    ...mapMutations({
      pause: 'player/pause'
    }),
    ...mapActions({
      switchSong: 'player/switchSong',
      removePlayList: 'player/removePlayList'
    })
  },
  mounted () {
    // 懒加载
    const observer = new IntersectionObserver(changes => {
      changes.forEach(change => {
        const ratio = change.intersectionRatio
        const target = change.target
        const flag = target.dataset.flag
        if (ratio > 0 && flag !== 'display') {
          target.classList.add('fade-in')
          target.dataset.flag = 'display'
          this.imgSrc = this.cover
        }
      })
    })
    observer.observe(this.$el)
  }
}
</script>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px 0;
  position: relative;
}
.list-item:nth-child(odd) {
  background-color: #FCFCFC;
}
.list-item:nth-child(even) {
  background-color: #f5f5f5;
}
.serial-box {
  font-size: 24px;
  width: 40px;
  color: #333;
  text-align: right;
}
.cover {
  width: 70px;
  height: 70px;
  margin: 0 20px;
}
.name {
  width: 40%;
  color: #333;
}
.singer {
  width: 40%;
  color: #333;
}
.duration {
  color: #999;
}
.function {
  position: absolute;
  right: 0;
  padding: 0 10px;
  height: 100%;
  display: none;
  align-items: center;
  background-color: inherit;
}
.list-item:hover .function {
  display: flex;
}
.fade-in {
  animation: fade .3s linear;
}
@keyframes fade {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.is-current .name,
.is-current .singer,
.is-current .duration {
  color: var(--themeColor);
}
</style>
