import Vue from 'vue'
import Vuex from 'vuex'
import batch from './batch.js'
import download from './download.js'
import player from './player.js'
import account from './account.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songList: []
  },
  mutations: {
    updateSongList (state, list) {
      state.songList = list
    }
  },
  actions: {
  },
  modules: {
    batch,
    download,
    player,
    account
  }
})
