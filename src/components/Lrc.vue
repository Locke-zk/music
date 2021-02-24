<template>
  <div class="lrc">
    <!-- 下载中 -->
    <ul class="download-state" v-if="player.download.state !== 'complete' && player.songInfo.id">
      <li class="download-item">音乐文件下载中 {{ player.download.percentage | formatPercentage }}</li>
    </ul>

    <!-- 歌词 -->
    <ul class="lrc-list" v-else :style="{ top }">
      <li class="lrc-item" v-if="textList.length > 1" style="height: 30px"></li>
      <li
        class="lrc-item"
        v-for="(text, index) of textList"
        :key="index"
        :class="{ current: index === lineIndex }"
        :style="{
          height: textList.length === 1 ? '90px' : '30px',
          lineHeight: textList.length === 1 ? '90px' : '30px',
          color: textList.length === 1 ? 'var(--themeColor)' : ''
        }"
      >{{ text }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      textList: [],
      timeList: [],
      lineIndex: 0
    }
  },
  computed: {
    ...mapState({
      player: state => state.player
    }),
    top () {
      return this.lineIndex * -30 + 'px'
    }
  },
  filters: {
    formatPercentage (percentage) {
      return parseInt(percentage) + '%'
    }
  },
  watch: {
    'player.currentTime': {
      handler () {
        for (let i = 0; i < this.timeList.length; i++) {
          if (this.player.currentTime >= this.timeList[i]) {
            this.lineIndex = i
          }
        }
      }
    },
    'player.songInfo.id': {
      handler (songId) {
        if (songId) {
          this.textList = []
          this.timeList = []
          this.lineIndex = 0
          fetch(this.$api + '/lrc?id=' + songId).then(res => res.json()).then(res => {
            this.timeList = res.timeList
            this.textList = res.textList
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.lrc {
  position: relative;
  overflow: hidden;
  height: 90px;
}
.download-state,
.lrc-list {
  position: absolute;
  top: 0;
  width: 100%;
  height: 90px;
  padding: 0 20px;
  transition: top .3s linear;
}
.download-item {
  height: 90px;
  line-height: 90px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
.lrc-item {
  text-align: center;
  color: #fff;
}
.current {
  color: var(--themeColor);
}
</style>
