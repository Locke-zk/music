<template>
  <div class="play-list">
    <!-- 功能模块 -->
    <div class="function" v-if="player.playList.length">
      <el-button size="small" @click="switchSong(player.playList[0].id)" v-if="!hiddStartPlayButton">开始播放</el-button>
      <el-button size="small" @click="clearPlayList">清空队列</el-button>
    </div>

    <!-- 提示文字 -->
    <p v-else style="font-size: 12px; color: #999; text-align: center">暂无播放歌曲</p>

    <!-- 歌曲列表 -->
    <ul class="list" v-if="player.playList.length">
      <!-- 标题 -->
      <li class="list-th">
        <span class="song">歌曲</span>
        <span class="singer">歌手</span>
        <span class="duration">时长</span>
      </li>

      <!-- 列表 -->
      <play-list-item
        v-for="(song, index) of player.playList"
        :key="song.id"
        :id="song.id"
        :serial="index + 1"
        :cover="song.cover"
        :name="song.name"
        :singer="song.singer"
        :duration="song.duration"
      ></play-list-item>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import playListItem from 'cpn/PlayListItem.vue'
export default {
  computed: {
    ...mapState({
      player: state => state.player
    }),
    hiddStartPlayButton () {
      return this.player.playList.length === 1 && !this.player.paused
    }
  },
  components: {
    playListItem
  },
  methods: {
    ...mapActions({
      switchSong: 'player/switchSong',
      clearPlayList: 'player/clearPlayList'
    })
  }
}
</script>

<style scoped>
.function {
  display: flex;
  justify-content: flex-end;
}
.list-th {
  margin-top: 20px;
}
.list-th span {
  display: inline-block;
  color: #999;
}
.list-th .song {
  width: calc(40% + 90px);
  margin-left: 60px;
}
.list-th .singer {
  width: 40%;
}
</style>
