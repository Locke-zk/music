<template>
  <div class="comment-item">
    <img :src="comment.userInfo.avatar" class="avatar" @click="showUserInfo = true">

    <div class="inner">
      <h2 class="nickname" @click="showUserInfo = true">{{ comment.userInfo.nickname }}</h2>
      <pre class="content">{{ comment.content }}</pre>
      <div class="interactive">
        <!-- 日期 -->
        <span class="date">{{ comment.date }}</span>
        <div class="interactive-right">
          <!-- 删除 -->
          <delete-comment-or-reply :user-id="comment.userInfo.id" :comment-or-reply-id="comment.id" type="comment" @delete-success="$emit('delete-success')"></delete-comment-or-reply>
          <!-- 评论 -->
          <reply :target-user-id="comment.userInfo.id" :comment-id="comment.id" reply-target-type="comment"></reply>
          <!-- 点赞 -->
          <likes :id="comment.id" type="comment" :number="comment.likes"></likes>
        </div>
      </div>
      <!-- 插槽：通常是首条回复 -->
      <div class="slot-box">
        <slot></slot>
      </div>
    </div>

    <!-- 用户资料 -->
    <el-dialog
      title="用户资料"
      :visible.sync="showUserInfo"
      append-to-body
      destroy-on-close
    >
      <user-info :account="comment.userInfo.account" :show-back="true" @close="showUserInfo = false"></user-info>
    </el-dialog>
  </div>
</template>

<script>
import deleteCommentOrReply from 'cpn/DeleteCommentOrReply.vue'
import reply from 'cpn/Reply.vue'
import likes from 'cpn/Likes.vue'
import userInfo from 'cpn/UserInfo.vue'
export default {
  props: [
    'comment'
  ],
  data () {
    return {
      showUserInfo: false
    }
  },
  components: {
    deleteCommentOrReply,
    reply,
    likes,
    userInfo
  }
}
</script>

<style scoped>
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
}
.comment-item {
  display: flex;
}
.inner {
  margin-left: 10px;
  flex: 1;
}
.nickname {
  font-size: 14px;
  cursor: pointer;
  display: inline-block;
}
.nickname:hover {
  color: var(--themeColor);
}
.content {
  padding: 10px 0;
}
.interactive {
  display: flex;
  justify-content: space-between;
}
.date {
  font-size: 12px;
  color: var(--secondaryColor);
}
.interactive-right {
  display: flex;
  align-items: center;
}
.interactive-right > *:not(:first-child) {
  margin-left: 10px;
}
.nickname:active {
  filter: brightness(1.2);
}
</style>
