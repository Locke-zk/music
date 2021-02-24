<template>
  <div class="comment">
    <!-- loading -->
    <el-collapse-transition>
      <loading v-if="loading"></loading>
    </el-collapse-transition>

    <template v-if="!loading && isLogin && player.songInfo.id">
      <!-- 添加评论 -->
      <div class="add-comment-box" style="display: flex; flex-direction: column; padding: 0 20px">
        <el-input type="textarea" :rows="3" v-model="commentContent" placeholder="添加评论"></el-input>
        <el-button type="primary" size="medium" style="margin-top: 20px;" :loading="publishCommentLoading" :disabled="!commentContent.length" @click="publishComment">发表</el-button>
      </div>
      <!-- 评论列表 -->
      <ul class="list">
        <li class="item" v-for="obj of player.comment" :key="obj.comment.id">
          <comment-item :comment="obj.comment">
            <!-- 首条回复 -->
            <template v-if="obj.reply.length">
              <reply-item :reply="obj.reply[0]" :comment-id="obj.comment.id"></reply-item>
              <!-- 更多回复 -->
              <div class="more-reply" @click="currentComment = obj, showMore = true">
                <span>全部{{ obj.reply.length }}条回复</span>
                <i class="el-icon-arrow-down"></i>
              </div>
            </template>
          </comment-item>
        </li>
      </ul>
    </template>

    <!-- 全部回复 -->
    <el-dialog
      :visible.sync="showMore"
      title="全部回复"
      append-to-body
      destroy-on-close
      width="688px"
      top="20px"
    >
      <template v-if="currentComment.comment">
        <!-- 评论 -->
        <comment-item :comment="currentComment.comment" @delete-success="showMore = false"></comment-item>
        <!-- 分割线 -->
        <div class="split-box">
          <div class="split"></div>
        </div>
        <!-- 回复 -->
        <reply-item v-for="reply of currentComment.reply" :key="reply.id" :reply="reply" :comment-id="currentComment.comment.id"></reply-item>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import commentItem from 'cpn/CommentItem.vue'
import replyItem from 'cpn/ReplyItem.vue'
import loading from 'cpn/Loading.vue'
export default {
  data () {
    return {
      loading: false,
      showMore: false,
      currentComment: {},
      commentContent: '',
      publishCommentLoading: false
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
      updateComment: 'player/updateComment',
      clearComment: 'player/clearComment',
      updateUserLikes: 'player/updateUserLikes',
      unshiftComment: 'player/unshiftComment'
    }),
    publishComment () {
      if (this.isLogin) {
        const fullDate = new Date()
        const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        this.publishCommentLoading = true
        fetch(this.$api + '/publish-comment', {
          method: 'POST',
          body: JSON.stringify({
            songId: this.player.songInfo.id,
            userId: this.userInfo.id,
            content: this.commentContent,
            date: date
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json()).then(res => {
          this.publishCommentLoading = false
          this.commentContent = ''
          this.unshiftComment(res.data)
        })
      } else {
        this.$message({
          message: '请登录',
          type: 'error'
        })
      }
    }
  },
  created () {
    // 请求评论
    if (this.player.songInfo.id) {
      this.loading = true
      this.clearComment()
      fetch(this.$api + '/comment?songId=' + this.player.songInfo.id).then(res => res.json()).then(res => {
        this.loading = false
        this.updateComment(res)
      })
    }
    // 请求用户点赞记录
    if (this.isLogin) {
      fetch(this.$api + '/get-user-likes', {
        method: 'POST',
        body: JSON.stringify({ userId: this.userInfo.id, songId: this.player.songInfo.id }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => {
        this.updateUserLikes(res)
      })
    }
  },
  components: {
    commentItem,
    replyItem,
    loading
  }
}
</script>

<style scoped>
.item {
  padding: 15px 20px;
}
.more-reply {
  font-size: 12px;
  color: var(--secondaryColor);
  cursor: pointer;
}
.more-reply:hover {
  color: var(--themeColor);
}
.more-reply:active {
  filter: brightness(1.2);
}
.more-reply i {
  margin-left: 5px;
}
.split-box {
  display: flex;
  height: 15px;
  align-items: center;
}
.split {
  width: 100%;
  height: 1px;
  background-color: #f6f6f6;
}
</style>
