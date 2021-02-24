export default {
  namespaced: true,
  state: () => ({
    userInfo: {},
    isLogin: false
  }),
  mutations: {
    updateUserInfo (state, info) {
      state.userInfo = info
    },
    updateLogin (state, bool) {
      state.isLogin = bool
    },
    exit (state) {
      state.userInfo = {}
      state.isLogin = false
      document.cookie = 'token=; expires=Thu, 01-Jan-1970 00:00:01 GMT'
    }
  }
}
