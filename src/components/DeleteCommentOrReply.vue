<template>
  <div class="delete" v-if="show" @click.once="del">
    <i class="el-icon-delete"></i>
    <span>删除</span>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: [
    'userId',
    'commentOrReplyId',
    'type'
  ],
  computed: {
    ...mapState({
      userInfo: state => state.account.userInfo
    }),
    show () {
      return this.userInfo.id === this.userId
    }
  },
  methods: {
    ...mapMutations({
      deleteCommentOrReply: 'player/deleteCommentOrReply'
    }),
    del () {
      fetch(this.$api + '/delete-comment-or-reply', {
        method: 'POST',
        body: JSON.stringify({ id: this.commentOrReplyId, type: this.type }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(() => {
        this.deleteCommentOrReply({
          id: this.commentOrReplyId,
          type: this.type
        })
        this.$message({
          type: 'success',
          message: '评论或回复删除成功'
        })
        this.$emit('delete-success')
      })
    }
  }
}
</script>

<style scoped>
.delete i {
  font-size: 14px;
}
.delete span {
  font-size: 12px;
  margin-left: 2px;
}
.delete {
  cursor: pointer;
  color: var(--secondaryColor);
}
.delete:hover {
  color: var(--themeColor)
}
.delete:active {
  filter: brightness(1.2);
}
</style>
