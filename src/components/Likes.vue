<template>
  <div class="likes" @click="likes" :style="{ color: isLikes ? 'var(--themeColor)' : 'var(--secondaryColor)' }">
    <i class="app app_zan"></i>
    <span>{{ number ? number : '赞' }}</span>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: [
    'id',
    'type',
    'number'
  ],
  data () {
    return {
      disabled: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.player,
      isLogin: state => state.account.isLogin,
      userInfo: state => state.account.userInfo
    }),
    isLikes () {
      return this.player.userLikes[this.type].includes(this.id)
    }
  },
  methods: {
    ...mapMutations({
      addLikesNumber: 'player/likes',
      reduceLikesNumber: 'player/cancelLikes',
      addUserLikes: 'player/addUserLikes',
      removeUserLikes: 'player/removeUserLikes'
    }),
    likes () {
      if (this.disabled) return
      this.disabled = true
      if (this.isLogin) {
        if (this.isLikes) {
          fetch(this.$api + '/cancel-likes', {
            method: 'POST',
            body: JSON.stringify({
              id: this.id,
              type: this.type,
              userId: this.userInfo.id,
              songId: this.player.songInfo.id
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json()).then(() => {
            this.reduceLikesNumber({
              type: this.type,
              id: this.id
            })
            this.removeUserLikes({
              type: this.type,
              id: this.id
            })
            this.disabled = false
          })
        } else {
          fetch(this.$api + '/likes', {
            method: 'POST',
            body: JSON.stringify({
              id: this.id,
              type: this.type,
              userId: this.userInfo.id,
              songId: this.player.songInfo.id
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json()).then(() => {
            this.addLikesNumber({
              type: this.type,
              id: this.id
            })
            this.addUserLikes({
              type: this.type,
              id: this.id
            })
            this.disabled = false
          })
        }
      } else {
        this.$message({
          message: '请登录',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.likes i {
  font-size: 14px;
}
.likes span {
  font-size: 12px;
  margin-left: 2px;
}
.likes {
  cursor: pointer;
  color: var(--secondaryColor);
}
.likes:hover {
  color: var(--themeColor)
}
.likes:active {
  filter: brightness(1.2);
}
</style>
