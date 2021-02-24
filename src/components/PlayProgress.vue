<template>
  <div class="play-progress">
    <slider :value="player.percentage" @change="progressChange">
      <template v-slot:default="data">
        <div class="tooltip-box">
          <span class="duration">{{ data.percentage | calcTime }}</span>
        </div>
      </template>
    </slider>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import slider from 'cpn/Slider.vue'
// 解决 filters this 指向问题
let that = null
export default {
  computed: {
    ...mapState({
      player: state => state.player
    })
  },
  methods: {
    progressChange (percentage) {
      this.player.audio.currentTime = parseFloat(percentage) / 100 * this.player.duration
    }
  },
  components: {
    slider
  },
  filters: {
    calcTime (percentage) {
      const time = parseFloat(percentage) / 100 * that.player.duration
      const min = Math.floor(time / 60)
      const sec = Math.floor(time % 60)

      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }
  },
  created () {
    that = this
  }
}
</script>

<style scoped>
.play-progress {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
