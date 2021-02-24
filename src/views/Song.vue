<template>
  <div class="song">
    <!-- loading -->
    <el-collapse-transition>
      <loading v-if="loading"></loading>
    </el-collapse-transition>

    <!-- 功能模块 -->
    <div class="function" v-if="!loading">
      <template v-if="isBatch">
        <el-button size="small" key="a" v-if="!isSelectAll" @click="selectAll">全选</el-button>
        <el-button size="small" key="b" v-else @click="clearBatchList">取消全选</el-button>
        <el-button size="small" key="c" @click="batchDownload">下载</el-button>
        <el-button size="small" key="d" @click="addPlayList(batchList)">添加到播放列表</el-button>
        <el-button size="small" @click="onCancelBatchHandler" key="e">取消批量操作</el-button>
      </template>
      <template v-else>
        <el-button size="small" @click="isBatch = true" key="f">批量操作</el-button>
        <el-button size="small" type="primary" key="g" @click="playAll">播放全部</el-button>
      </template>
    </div>

    <!-- 歌曲列表 -->
    <ul class="list" v-if="!loading">
      <!-- 标题 -->
      <li class="list-th">
        <span class="song">歌曲</span>
        <span class="singer">歌手</span>
        <span class="duration">时长</span>
      </li>

      <!-- 列表 -->
      <song-list-item
        v-for="(song, index) of songList"
        :key="song.id"
        :id="song.id"
        :serial="index + 1"
        :cover="song.cover"
        :name="song.name"
        :singer="song.singer"
        :duration="song.duration"
        :is-batch="isBatch"
      ></song-list-item>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import loading from 'cpn/Loading.vue'
import songListItem from 'cpn/SongListItem.vue'
export default {
  data () {
    return {
      loading: true,
      isBatch: false
    }
  },
  methods: {
    ...mapMutations({
      updateSongList: 'updateSongList',
      addBatchList: 'batch/add',
      clearBatchList: 'batch/clear'
    }),
    ...mapActions({
      addDownloadTask: 'download/addDownloadTask',
      addPlayList: 'player/addPlayList',
      switchSong: 'player/switchSong'
    }),
    selectAll () {
      this.clearBatchList()
      for (const song of this.songList) {
        this.addBatchList(song.id)
      }
    },
    onCancelBatchHandler () {
      this.isBatch = false
    },
    playAll () {
      this.addPlayList(this.songList.map(song => song.id))
      this.switchSong(this.songList[0].id)
    },
    batchDownload () {
      this.batchList.forEach(id => this.addDownloadTask(id))
    }
  },
  watch: {
    isBatch: {
      handler () {
        this.clearBatchList()
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      songList: state => state.songList,
      batchList: state => state.batch.batchList
    }),
    isSelectAll () {
      return this.batchList.length === this.songList.length
    }
  },
  components: {
    loading,
    songListItem
  },
  created () {
    this.loading = true
    this.updateSongList([])
    fetch(this.$api + '/song-list').then(res => res.json()).then(res => {
      this.loading = false
      this.updateSongList(res)
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
