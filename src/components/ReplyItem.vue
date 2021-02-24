<template>
  <div class="reply-item">
    <img :src="reply.userInfo.avatar" class="avatar" @click="userInfoAccount = reply.userInfo.account, showUserInfo = true">

    <div class="inner">
      <div class="nickname-box">
        <h2 class="nickname" @click="userInfoAccount = reply.userInfo.account, showUserInfo = true">{{ reply.userInfo.nickname }}</h2>
        <span>回复</span>
        <h2 class="nickname" @click="userInfoAccount = reply.targetUserInfo.account, showUserInfo = true">{{ reply.targetUserInfo.nickname }}</h2>
      </div>
      <pre class="content">{{ reply.content }}</pre>
      <div class="interactive">
        <!-- 日期 -->
        <span class="date">{{ reply.date }}</span>
        <div class="interactive-right">
          <!-- 删除 -->
          <delete-comment-or-reply :user-id="reply.userInfo.id" :comment-or-reply-id="reply.id" type="reply"></delete-comment-or-reply>
          <!-- 评论 -->
          <reply :target-user-id="reply.userInfo.id" :comment-id="commentId" reply-target-type="comment"></reply>
          <!-- 点赞 -->
          <likes :id="reply.id" type="reply" :number="reply.likes"></likes>
        </div>
      </div>
    </div>

    <!-- 用户资料 -->
    <el-dialog
      title="用户资料"
      :visible.sync="showUserInfo"
      append-to-body
      destroy-on-close
    >
      <user-info :account="userInfoAccount" :show-back="true" @close="showUserInfo = false"></user-info>
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
    'reply',
    'commentId'
  ],
  data () {
    return {
      showUserInfo: false,
      userInfoAccount: ''
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.reply-item {
  display: flex;
  padding: 10px 0;
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
.slot-box {
  margin-top: 10px;
}
.nickname-box span {
  margin: 0 5px;
}
.nickname:active {
  filter: brightness(1.2);
}
</style>
