import _ from 'lodash'

// 节流
let isRun = true
function throttle (fn) {
  if (!isRun) return
  isRun = false
  setTimeout(() => {
    fn()
    isRun = true
  }, 500)
}

export default {
  namespaced: true,
  state: () => ({
    taskList: []
  }),
  mutations: {
    abort (state, id) {
      const index = _.findIndex(state.taskList, task => task.id === id)
      if (index !== -1) {
        state.startLoaded = 0
        state.taskList[index].xhr.abort()
      }
    },
    remove (state, id) {
      const index = _.findIndex(state.taskList, task => task.id === id)
      if (index !== -1) {
        state.taskList[index].xhr.abort()
        state.taskList.splice(index, 1)
      }
    },
    clear (state) {
      for (const task of state.taskList) {
        task.xhr.abort()
      }
      state.taskList = []
    },
    allStop (state) {
      for (const task of state.taskList) {
        if (task.state === 'running') {
          task.xhr.abort()
        }
      }
    }
  },
  actions: {
    addDownloadTask ({ state, rootState, dispatch }, id) {
      const index = _.findIndex(rootState.songList, song => song.id === id)
      if (index !== -1) {
        const task = {
          xhr: new XMLHttpRequest(),
          state: 'running',
          songInfo: rootState.songList[index],
          loaded: '0MB',
          total: '0MB',
          speed: '0KB/s',
          percentage: '0%',
          id: Date.now(),
          startTime: Date.now(),
          startLoaded: 0
        }
        let timer = null
        task.xhr.responseType = 'blob'
        task.xhr.addEventListener('abort', () => {
          task.state = 'stop'
        })
        task.xhr.addEventListener('error', () => {
          task.state = 'error'
        })
        task.xhr.addEventListener('progress', event => {
          const endTime = Date.now()
          const endLoaded = event.loaded
          const duration = (endTime - task.startTime) / 1000
          const loadedDiff = endLoaded - task.startLoaded
          const loadedDiffMB = loadedDiff / 1024 / 1024
          const loadedDiffKB = loadedDiff / 1024
          const speedMB = loadedDiffMB / duration
          const speedKB = loadedDiffKB / duration
          let speed = speedMB > 1 ? speedMB.toFixed(2) + 'MB/s' : speedKB.toFixed(2) + 'KB/s'
          task.loaded = (event.loaded / 1024 / 1024).toFixed(2) + 'MB'
          task.total = (event.total / 1024 / 1024).toFixed(2) + 'MB'
          task.percentage = event.loaded / event.total * 100 + '%'
          task.state = 'running'
          // 解决突然停止下载但速度并未改变
          clearTimeout(timer)
          throttle(() => {
            timer = setTimeout(() => {
              speed = '0KB/s'
              task.speed = speed
            }, 1000)
            task.speed = speed
          })
          task.startTime = endTime
          task.startLoaded = endLoaded
        })
        task.xhr.addEventListener('load', () => {
          const linkNode = document.createElement('a')
          const suffix = task.songInfo.url.match(/.+\.(.*)/)[1]
          const fileName = `${task.songInfo.singer} - ${task.songInfo.name}.${suffix}`
          linkNode.href = URL.createObjectURL(task.xhr.response)
          linkNode.download = fileName
          linkNode.style.display = 'none'
          document.body.appendChild(linkNode)
          linkNode.click()
          document.body.removeChild(linkNode)
          task.state = 'complete'
        })
        state.taskList.push(task)
        dispatch('download', task.id)
      }
    },
    download ({ state }, id) {
      const index = _.findIndex(state.taskList, task => task.id === id)
      if (index !== -1) {
        state.taskList[index].state = 'running'
        state.taskList[index].startLoaded = 0
        state.taskList[index].xhr.open('GET', state.taskList[index].songInfo.url + '?t=' + Date.now(), true)
        state.taskList[index].xhr.send()
      }
    },
    allDownload ({ state, dispatch }) {
      for (const task of state.taskList) {
        if (task.state === 'stop') {
          dispatch('download', task.id)
        }
      }
    }
  }
}
