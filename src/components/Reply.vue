<template>
  <div class="reply" @click="show = true">
    <i class="app app_pinglun"></i>
    <span>回复</span>

    <el-dialog
      :visible.sync="show"
      title="回复"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      @close="content = ''"
      width="780px"
    >
      <div style="display: flex; flex-direction: column;">
        <el-input
          type="textarea"
          :rows="4"
          v-model="content"
          placeholder="填写回复"
        ></el-input>

        <el-button type="primary" style="margin-top: 20px;" :disabled="!content.length" :loading="loading" @click="publish">发表</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: [
    'targetUserId',
    'commentId',
    'replyTargetType'
  ],
  data () {
    return {
      content: '',
      show: false,
      loading: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.player,
      userInfo: state => state.account.userInfo,
      isLogin: state => state.account.isLogin
    })
  },

  methods: {
    ...mapMutations({
      pushReply: 'player/pushReply'
    }),

    publish () {
      if (this.isLogin) {
        const fullDate = new Date()
        const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        this.loading = true
        fetch(this.$api + '/publish-reply', {
          method: 'POST',
          body: JSON.stringify({
            songId: this.player.songInfo.id,
            commentId: this.commentId,
            userId: this.userInfo.id,
            targetId: this.targetUserId,
            content: this.content,
            date
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(res => {
          this.loading = false
          this.content = ''
          this.show = false
          this.pushReply({
            commentId: this.commentId,
            data: res.data
          })
        })
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
.reply i {
  font-size: 14px;
}
.reply span {
  font-size: 12px;
  margin-left: 2px;
}
.reply {
  cursor: pointer;
  color: var(--secondaryColor);
}
.reply:hover {
  color: var(--themeColor)
}
.reply:active {
  filter: brightness(1.2);
}
</style>
