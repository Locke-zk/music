import _ from 'lodash'

export default {
  namespaced: true,
  state: () => ({
    batchList: []
  }),
  mutations: {
    add (state, id) {
      state.batchList.push(id)
    },
    remove (state, id) {
      const index = _.findIndex(state.batchList, i => i === id)

      if (index !== -1) {
        state.batchList.splice(index, 1)
      }
    },
    clear (state) {
      state.batchList = []
    }
  }
}
