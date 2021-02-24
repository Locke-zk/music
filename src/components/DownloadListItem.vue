<template>
  <li class="list-item">
    <!-- 序号 -->
    <pre class="serial">{{ serial }}</pre>
    <!-- 歌曲 -->
    <span class="name">{{ name }}</span>
    <!-- 进度 -->
    <div class="progress">
      <div class="progress-inner" :style="{
        width: percentage,
        backgroundColor: colors[state]
      }"></div>
    </div>
    <span class="progress-text">{{ loaded }} / {{ total }}</span>
    <!-- 速率 -->
    <span class="speed">{{ speed }}</span>
    <!-- 状态 -->
    <span class="state" :style="{ color: colors[state] }">{{ state }}</span>
    <!-- 功能模块 -->
    <div class="function">
      <el-button size="small" v-if="state === '进行中'" @click="abort(id)">暂停</el-button>
      <el-button size="small" v-if="state === '已暂停'" @click="download(id)">下载</el-button>
      <el-button size="small" v-if="state === '已失败'" @click="download(id)">重新下载</el-button>
      <el-button size="small" @click="remove(id)">移除</el-button>
    </div>
  </li>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  props: [
    'serial',
    'name',
    'percentage',
    'loaded',
    'total',
    'speed',
    'state',
    'id'
  ],
  data () {
    return {
      colors: {
        进行中: '#67C23A',
        已暂停: 'var(--errorColor)',
        已失败: 'var(--errorColor)',
        已完成: 'var(--themeColor)'
      }
    }
  },
  methods: {
    ...mapMutations({
      abort: 'download/abort',
      remove: 'download/remove'
    }),
    ...mapActions({
      download: 'download/download'
    })
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
.serial {
  font-size: 24px;
  width: 40px;
  color: #333;
  text-align: right;
}
.name {
  width: 20%;
  color: #333;
  margin-left: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.progress {
  width: 40%;
  height: 4px;
  background-color: #ddd;
}
.progress-inner {
  width: 0;
  height: 100%;
  transition: width .3s linear;
}
.progress-text {
  width: 12%;
  color: #333;
  margin-left: 20px;
}
.speed {
  width: 10%;
  color: #333;
}
.state {
  color: #333;
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
</style>
