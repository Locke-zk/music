<template>
  <li class="list-item" :class="{ 'is-batch': isBatch, 'is-current': isCurrent }">
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
      <el-button size="small" v-else @click="pause">暂停</el-button>
      <el-button size="small" @click="addPlayList([id])" v-if="showAddPlayListButton">添加到播放列表</el-button>
      <el-button size="small" @click="addDownloadTask(id)">下载</el-button>
    </ul>
    <!-- 批量操作 -->
    <div class="batch" v-if="isBatch" @click="select">
      <i class="app app_weixuanzhong" style="color: #999" v-if="!isIncludeInBatchList"></i>
      <i class="app app_xuanzhong" style="color: var(--themeColor)" v-else></i>
    </div>
  </li>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import _ from 'lodash'
export default {
  props: [
    'id',
    'serial',
    'cover',
    'name',
    'singer',
    'duration',
    'isBatch'
  ],
  data () {
    return {
      imgSrc: require('img/square.png')
    }
  },
  computed: {
    ...mapState({
      batchList: state => state.batch.batchList,
      player: state => state.player
    }),
    isIncludeInBatchList () {
      return this.batchList.includes(this.id)
    },
    isCurrent () {
      return this.id === this.player.songInfo.id
    },
    isPlay () {
      return this.isCurrent && !this.player.paused
    },
    showAddPlayListButton () {
      const index = _.findIndex(this.player.playList, song => song.id === this.id)
      return index === -1
    }
  },
  methods: {
    ...mapMutations({
      addBatchList: 'batch/add',
      removeBatchList: 'batch/remove',
      pause: 'player/pause'
    }),
    ...mapActions({
      addDownloadTask: 'download/addDownloadTask',
      addPlayList: 'player/addPlayList',
      switchSong: 'player/switchSong'
    }),
    select () {
      if (this.isIncludeInBatchList) {
        this.removeBatchList(this.id)
      } else {
        this.addBatchList(this.id)
      }
    }
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
.list-item:not(.is-batch):hover .function {
  display: flex;
}
.batch {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
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
