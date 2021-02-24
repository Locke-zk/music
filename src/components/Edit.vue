<template>
  <div class="edit">
    <ul class="edit-inr" v-if="!showClipAvatar">
      <!-- 头像 -->
      <li>
        <label>头像</label>
        <div class="avatar" @click="showClipAvatar = true">
          <img :src="avatar">
          <div class="mask el-icon-setting"></div>
        </div>
      </li>

      <!-- 昵称 -->
      <li>
        <label>昵称</label>
        <el-input
          type="text"
          v-model="nickname"
          clearable
          class="nickname"
        ></el-input>
      </li>

      <!-- 性别 -->
      <li>
        <label>性别</label>
        <el-select v-model="gender" class="gender">
          <el-option
            v-for="item of selectOption"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>

      <!-- 个签 -->
      <li>
        <label>个签</label>
        <el-input
          type="textarea"
          v-model="introduction"
          class="introduction"
        ></el-input>
      </li>

      <!-- 按钮 -->
      <li class="btns">
        <el-button type="primary" @click="save" :loading="updating">保存</el-button>
        <el-button @click="$emit('close')" :loading="updating">返回</el-button>
      </li>
    </ul>

    <!-- 头像裁剪 -->
    <clip-avatar v-if="showClipAvatar" @close="showClipAvatar = false" v-model="avatar"></clip-avatar>
  </div>
</template>

<script>
import clipAvatar from 'cpn/Avatar.vue'
import { mapMutations } from 'vuex'
export default {
  props: [
    'userInfo'
  ],
  data () {
    return {
      id: this.userInfo.id,
      avatar: this.userInfo.avatar,
      nickname: this.userInfo.nickname,
      gender: this.userInfo.gender,
      introduction: this.userInfo.introduction,
      selectOption: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      showClipAvatar: false,
      updating: false
    }
  },
  methods: {
    ...mapMutations({
      updateUserInfo: 'account/updateUserInfo'
    }),
    save () {
      this.updating = true
      fetch(this.$api + '/update-user-info', {
        method: 'POST',
        body: JSON.stringify({
          avatar: this.avatar,
          nickname: this.nickname,
          gender: this.gender,
          introduction: this.introduction,
          id: this.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json()).then(res => {
        this.updateUserInfo(res.userInfo)
        this.$message({
          message: '资料更新成功',
          type: 'success'
        })
        this.$emit('close')
      })
    }
  },
  components: {
    clipAvatar
  }
}
</script>

<style scoped>
.edit-inr li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}
.avatar {
  width: 60px;
  height: 60px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.edit-inr li label {
  width: 60px;
  text-align: right;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  opacity: 0;
  font-size: 18px;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s;
}
.avatar:hover .mask {
  opacity: 1;
}
.nickname,
.introduction {
  width: 500px;
}
.btns {
  justify-content: space-around !important;
  padding-top: 30px !important;
}
</style>
