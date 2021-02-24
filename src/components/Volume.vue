<template>
  <div class="volume">
    <div class="icon-box">
      <button
        :class="player.volume ? 'app app_yinliang' : 'app app_jingyin'"
        :style="{
          color: player.volume ? '#fff' : 'var(--errorColor)'
        }"
      ></button>
    </div>

    <div class="control">
      <slider
        :tooltip="false"
        :vertical="true"
        :value="player.volume + '%'"
        @input="updateVolume"
      ></slider>

      <span class="volume-text">{{ player.volume }}</span>

      <div class="icon-box control-volume-icon">
        <button class="app app_yinliang" v-if="!player.volume" @click="updateVolume(100)"></button>
        <button class="app app_jingyin" style="color: var(--errorColor)" v-else @click="updateVolume(0)"></button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import slider from 'cpn/Slider.vue'
export default {
  computed: {
    ...mapState({
      player: state => state.player
    })
  },
  components: {
    slider
  },
  methods: {
    updateVolume (percentage) {
      this.player.audio.volume = 1 * (parseFloat(percentage) / 100)
    }
  }
}
</script>

<style scoped>
.volume {
  position: relative;
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
.control {
  position: absolute;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  height: 170px;
  background-color: #000;
  border-radius: 10px;
  display: none;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px 10px 10px;
  width: 32px;
}
.control::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 10px;
  bottom: -10px;
}
.volume:hover .control {
  display: flex;
}
.control::after {
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
.volume-text {
  color: hsla(0, 0%, 100%, .8);
  margin: 5px 0;
  font-size: 12px;
}
.control-volume-icon {
  border-top: 1px solid hsla(0, 0%, 100%, .4);
  padding-top: 5px;
  box-sizing: content-box;
}
</style>
