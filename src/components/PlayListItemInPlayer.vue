<template>
  <div class="item" :class="{ current: isCurrent }">
    <h2 class="name">
      {{ name }}
      <i class="app app_ziyuanldpi"></i>
    </h2>
    <div class="info">
      <span class="singer">{{ singer }}</span>
      <span class="duration">{{ duration }}</span>
    </div>
    <div class="btn-box">
      <el-button size="small" v-if="!isPlay" @click="switchSong(id)">播放</el-button>
      <el-button size="small" v-else @click="pause">暂停</el-button>
      <el-button size="small" @click="removePlayList(id)">移除</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: [
    'id',
    'name',
    'singer',
    'duration'
  ],
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
  }
}
</script>

<style scoped>
.item {
  position: relative;
  padding: 15px 20px;
}
.app_ziyuanldpi {
  display: none;
}
.current .app_ziyuanldpi {
  display: block;
  font-size: 12px;
  margin-left: 5px;
}
.name {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  color: var(--secondaryColor);
  font-size: 12px;
}
.btn-box {
  position: absolute;
  right: 0;
  height: 100%;
  top: 0;
  display: none;
  align-items: center;
  background-color: #fff;
  padding: 0 10px;
}
.item:hover .btn-box {
  display: flex;
}
.current .name,
.current .singer,
.current .duration {
  color: var(--themeColor);
}
</style>
