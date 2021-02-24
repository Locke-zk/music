import _ from 'lodash'

export default {
  namespaced: true,
  state: () => ({
    playList: [],
    download: {
      xhr: new XMLHttpRequest(),
      percentage: '0%',
      state: 'ready'
    },
    songInfo: {
      name: '让生活充满音乐！',
      singer: 'Locke'
    },
    audio: new Audio(),
    percentage: '0%',
    currentTime: 0.001,
    duration: 0.001,
    paused: true,
    playModel: 'loop',
    volume: 100,
    comment: [],
    userLikes: {
      comment: [],
      reply: []
    }
  }),
  mutations: {
    pause (state) {
      if (state.download.state === 'complete') {
        if (!state.audio.paused) {
          state.audio.pause()
        }
      } else {
        // 音乐文件正在下载中...
        state.download.xhr.abort()
      }
      state.paused = true
    },
    updatePlayModel (state, model) {
      if (state.playModel !== model) {
        state.playModel = model
      }
    },
    initData (state) {
      state.download.state = 'ready'
      state.percentage = '0%'
      state.songInfo = {
        name: '让生活充满音乐！',
        singer: 'Locke'
      }
      state.currentTime = 0.001
      state.duration = 0.001
    },
    updateComment (state, comment) {
      state.comment = comment
    },
    clearComment (state) {
      state.comment = []
    },
    likes (state, payload) {
      switch (payload.type) {
        case 'comment': {
          const index = _.findIndex(state.comment, c => c.comment.id === payload.id)
          state.comment[index].comment.likes++
          break
        }
        case 'reply': {
          for (const c of state.comment) {
            const index = _.findIndex(c.reply, r => r.id === payload.id)
            if (index !== -1) {
              c.reply[index].likes++
              break
            }
          }
          break
        }
      }
    },
    cancelLikes (state, payload) {
      console.log(1)
      switch (payload.type) {
        case 'comment': {
          const index = _.findIndex(state.comment, c => c.comment.id === payload.id)
          state.comment[index].comment.likes--
          break
        }
        case 'reply': {
          for (const c of state.comment) {
            const index = _.findIndex(c.reply, r => r.id === payload.id)
            if (index !== -1) {
              c.reply[index].likes--
              break
            }
          }
          break
        }
      }
    },
    updateUserLikes (state, data) {
      state.userLikes = data
    },
    addUserLikes (state, payload) {
      switch (payload.type) {
        case 'comment': {
          state.userLikes.comment.push(payload.id)
          break
        }
        case 'reply': {
          state.userLikes.reply.push(payload.id)
          break
        }
      }
    },
    removeUserLikes (state, payload) {
      switch (payload.type) {
        case 'comment': {
          const index = _.findIndex(state.userLikes.comment, c => c === payload.id)
          state.userLikes.comment.splice(index, 1)
          break
        }
        case 'reply': {
          const index = _.findIndex(state.userLikes.reply, r => r === payload.id)
          state.userLikes.reply.splice(index, 1)
          break
        }
      }
    },
    deleteCommentOrReply (state, payload) {
      switch (payload.type) {
        case 'comment': {
          const index = _.findIndex(state.comment, c => c.comment.id === payload.id)
          if (index !== -1) {
            state.comment.splice(index, 1)
          }
          break
        }
        case 'reply': {
          for (const c of state.comment) {
            const index = _.findIndex(c.reply, r => r.id === payload.id)
            if (index !== -1) {
              c.reply.splice(index, 1)
              break
            }
          }
          break
        }
      }
    },
    unshiftComment (state, data) {
      state.comment.unshift({
        comment: data,
        reply: []
      })
    },
    pushReply (state, payload) {
      const index = _.findIndex(state.comment, c => c.comment.id === payload.commentId)
      if (index !== -1) {
        state.comment[index].reply.push(payload.data)
      }
    }
  },
  actions: {
    addPlayList ({ state, rootState }, idList) {
      for (const id of idList) {
        const index = _.findIndex(state.playList, song => song.id === id)
        if (index === -1) {
          const index = _.findIndex(rootState.songList, song => song.id === id)
          if (index !== -1) {
            state.playList.push(rootState.songList[index])
          }
        }
      }
    },
    play ({ state }) {
      // 首次进入播放器点击播放时播放列表中的第一首音乐
      if (!state.songInfo.url && state.playList.length) {
        state.songInfo = state.playList[0]
      }
      // 播放音乐前先下载音乐文件
      if (state.download.state === 'complete' && state.audio.paused) {
        state.audio.play()
      } else if (state.download.state !== 'complete') {
        if (state.songInfo.url) {
          state.paused = false
          state.download.xhr.open('GET', state.songInfo.url, true)
          state.download.xhr.responseType = 'blob'
          state.download.xhr.send()
        }
      }
    },
    switchSong ({ state, rootState, dispatch, commit }, songId) {
      if (state.songInfo.id === songId) {
        return dispatch('play')
      }
      commit('pause')
      commit('initData')
      const index = _.findIndex(state.playList, song => song.id === songId)
      if (index !== -1) {
        state.download.state = 'ready'
        state.songInfo = state.playList[index]
        dispatch('play')
      } else {
        dispatch('addPlayList', [songId])
        const index = _.findIndex(rootState.songList, song => song.id === songId)
        if (index !== -1) {
          state.download.state = 'ready'
          state.songInfo = rootState.songList[index]
          dispatch('play')
        }
      }
    },
    initEvent ({ state, dispatch }) {
      state.audio.addEventListener('canplay', () => {
        state.audio.play()
      })
      state.audio.addEventListener('timeupdate', () => {
        if (!state.paused) {
          state.percentage = state.audio.currentTime / state.audio.duration * 100 + '%'
          state.currentTime = state.audio.currentTime
          state.duration = state.audio.duration
        }
      })
      state.audio.addEventListener('play', () => {
        state.paused = false
      })
      state.audio.addEventListener('pause', () => {
        state.paused = true
      })
      state.audio.addEventListener('volumechange', () => {
        state.volume = parseInt(state.audio.volume * 100)
      })
      state.audio.addEventListener('ended', () => {
        switch (state.playModel) {
          case 'loop': {
            let index = _.findIndex(state.playList, song => song.id === state.songInfo.id)
            if (index !== -1) {
              index++
              if (index >= state.playList.length) {
                index = 0
              }
              dispatch('switchSong', state.playList[index].id)
            }
            break
          }
          case 'random': {
            const id = state.playList[Math.floor(Math.random() * state.playList.length)].id
            dispatch('switchSong', id)
            break
          }
          case 'single': {
            state.audio.currentTime = 0
            break
          }
          case 'order': {
            let index = _.findIndex(state.playList, song => song.id === state.songInfo.id)
            if (index !== -1) {
              index++
              if (index < state.playList.length) {
                dispatch('switchSong', state.playList[index].id)
              }
            }
            break
          }
        }
      })
      // 在下载文件时点击了暂停
      state.download.xhr.addEventListener('abort', () => {
        state.download.state = 'stop'
      })
      // 在下载文件时意外的出错了
      state.download.xhr.addEventListener('error', () => {
        state.download.state = 'error'
      })
      // 下载中
      state.download.xhr.addEventListener('progress', event => {
        state.download.state = 'ready'
        state.download.percentage = event.loaded / event.total * 100 + '%'
      })
      // 下载完成
      state.download.xhr.addEventListener('load', () => {
        state.download.state = 'complete'
        state.audio.src = URL.createObjectURL(state.download.xhr.response)
      })
    },
    next ({ state, dispatch }) {
      if (state.playModel === 'random') {
        const id = state.playList[Math.floor(Math.random() * state.playList.length)].id
        dispatch('switchSong', id)
      } else {
        let index = _.findIndex(state.playList, song => song.id === state.songInfo.id)
        if (index !== -1) {
          index++
          if (index >= state.playList.length) {
            index = 0
          }
          dispatch('switchSong', state.playList[index].id)
        }
      }
    },
    prev ({ state, dispatch }) {
      if (state.playModel === 'random') {
        const id = state.playList[Math.floor(Math.random() * state.playList.length)].id
        dispatch('switchSong', id)
      } else {
        let index = _.findIndex(state.playList, song => song.id === state.songInfo.id)
        if (index !== -1) {
          index--
          if (index < 0) {
            index = state.playList.length - 1
          }
          dispatch('switchSong', state.playList[index].id)
        }
      }
    },
    removePlayList ({ state, dispatch, commit }, id) {
      const index = _.findIndex(state.playList, song => song.id === id)
      if (index !== -1) {
        if (state.playList[index].id === state.songInfo.id && state.playList[index + 1]) {
          dispatch('switchSong', state.playList[index + 1].id)
        }
        if (!state.playList[index + 1]) {
          commit('pause')
          commit('initData')
        }
        state.playList.splice(index, 1)
      }
    },
    clearPlayList ({ state, commit }) {
      state.playList = []
      commit('pause')
      commit('initData')
    }
  }
}
