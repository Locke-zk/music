<template>
  <div class="download">
    <!-- 功能模块 -->
    <div class="function" v-if="downloadTaskNumber">
      <el-button size="small" v-if="isIncludeRunning" @click="allStop">全部暂停</el-button>
      <el-button size="small" v-if="isAllStop" @click="allDownload">开始下载</el-button>
      <el-button size="small" @click="clear">清空列表</el-button>
    </div>

    <!-- 提示文字 -->
    <p v-else style="font-size: 12px; color: #999; text-align: center">暂无下载任务</p>

    <!-- 下载列表 -->
    <ul class="list" v-if="downloadTaskNumber">
      <!-- 标题 -->
      <li class="list-th">
        <span class="name">歌曲</span>
        <span class="progress">进度</span>
        <span class="speed">速率</span>
        <span class="state">状态</span>
      </li>

      <!-- 列表 -->
      <download-list-item
        v-for="(task, index) of taskList"
        :key="index"
        :id="task.id"
        :serial="index + 1"
        :name="task.songInfo.name"
        :percentage="task.percentage"
        :loaded="task.loaded"
        :total="task.total"
        :speed="task.speed"
        :state="state[task.state]"
      ></download-list-item>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import downloadListItem from 'cpn/DownloadListItem.vue'
export default {
  data () {
    return {
      state: {
        running: '进行中',
        stop: '已暂停',
        error: '已失败',
        complete: '已完成'
      }
    }
  },
  computed: {
    ...mapState({
      downloadTaskNumber: state => state.download.taskList.length,
      taskList: state => state.download.taskList
    }),
    isIncludeRunning () {
      return this.taskList.some(task => task.state === 'running')
    },
    isAllStop () {
      const stateList = []
      for (const task of this.taskList) {
        stateList.push(task.state)
      }
      return stateList.includes('stop') && !stateList.includes('running')
    }
  },
  components: {
    downloadListItem
  },
  methods: {
    ...mapMutations({
      allStop: 'download/allStop',
      clear: 'download/clear'
    }),
    ...mapActions({
      allDownload: 'download/allDownload'
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
  color: #999;
  display: inline-block;
}
.list-th .name {
  margin-left: 60px;
  width: 20%;
}
.list-th .progress {
  width: calc(52% + 20px);
}
.list-th .speed {
  width: 10%;
}
</style>
