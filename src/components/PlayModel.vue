<template>
  <div class="play-model">
    <div class="icon-box">
      <button :class="map[currentModel]"></button>
    </div>

    <ul class="select">
      <li
        class="select-item"
        :class="{ current: model.label === currentModel }"
        v-for="model of modelList"
        :key="model.label"
        @click="onClickHandler(model.label)"
      >
        <i :class="map[model.label]"></i>
        <span>{{ model.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      modelList: [
        {
          label: 'random',
          text: '随机播放'
        },
        {
          label: 'single',
          text: '单曲循环'
        },
        {
          label: 'order',
          text: '顺序播放'
        },
        {
          label: 'loop',
          text: '列表循环'
        }
      ],
      map: {
        single: 'app app_danquxunhuan',
        loop: 'app app_liebiaoxunhuan',
        random: 'app app_suijibofang',
        order: 'app app_shunxubofang'
      }
    }
  },
  computed: {
    ...mapState({
      currentModel: state => state.player.playModel
    })
  },
  methods: {
    ...mapMutations({
      updatePlayModel: 'player/updatePlayModel'
    }),
    onClickHandler (model) {
      this.updatePlayModel(model)
    }
  }
}
</script>

<style scoped>
.play-model {
  position: relative;
}
.play-model:hover .select {
  display: block;
}
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin: 0 10px;
}
.icon-box button {
  color: #fff;
  font-size: 18px;
}
.icon-box:hover button {
  color: var(--themeColor);
}
.icon-box:active button {
  filter: brightness(1.2);
}
.icon-box.large button {
  font-size: 30px;
}
.select {
  position: absolute;
  bottom: 40px;
  width: 120px;
  background-color: #000;
  color: hsla(0, 0%, 100%, .8);
  left: 50%;
  display: none;
  transform: translateX(-50%);
  font-size: 12px;
  border-radius: 10px;
  padding: 10px 0;
}
.select::after {
  position: absolute;
  content: '';
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-top-color: #000;
  bottom: -12px;
}
.select::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 10px;
  bottom: -10px;
}
.select-item {
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.select-item i {
  margin-right: 8px;
}
.select-item:hover,
.current {
  background-color: hsla(0, 0%, 100%, .2);
  color: var(--themeColor);
}
</style>
