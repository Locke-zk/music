import Vue from 'vue'
import VueRouter from 'vue-router'
// import song from 'views/Song.vue'
// import playList from 'views/PlayList.vue'
// import download from 'views/Download.vue'
// import player from 'views/Player.vue'
// import login from 'views/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/song'
    },
    {
      path: '/song',
      component: () => import('views/Song.vue')
      // component: song
    },
    {
      path: '/list',
      component: () => import('views/PlayList.vue')
      // component: playList
    },
    {
      path: '/download',
      component: () => import('views/Download.vue')
      // component: download
    },
    {
      path: '/player',
      component: () => import('views/Player.vue')
      // component: player
    },
    {
      path: '/login',
      component: () => import('views/Login.vue')
      // component: login
    }
  ]
})

export default router
