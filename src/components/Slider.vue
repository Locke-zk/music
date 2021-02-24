<template>
  <div
    class="slider"
    :class="vertical ? 'vertical' : 'horizontal'"
    @click="click"
    @mousemove="horizontalTooltip"
    @mouseleave="showTooltip = false"
  >
    <div class="slider__track"></div>

    <div
      class="slider__progress"
      :style="{ [vertical ? 'height' : 'width']: percentage }"
    >
      <i class="slider__circle" @mousedown="move"></i>
    </div>

    <transition name="fade-in">
      <div class="slider__tooltip" v-if="showTooltip">
        <slot :percentage="parseInt(tooltipContent) + '%'">{{ tooltipContent | formatPercentage }}</slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    value: {
      type: String
    }
  },
  data () {
    return {
      percentage: '0%',
      showTooltip: false,
      tooltipContent: '0%',
      disabled: false
    }
  },
  methods: {
    move () {
      if (this.vertical) {
        this.verticalSliderMove()
      } else {
        this.horizontalSliderMove()
      }
    },
    click () {
      if (this.vertical) {
        this.verticalSliderClick()
      } else {
        this.horizontalSliderClick()
      }
    },
    horizontalSliderMove () {
      const rect = this.$el.getBoundingClientRect()
      const left = parseInt(rect.left)
      const width = parseInt(rect.width)
      this.disabled = true
      document.body.onmousemove = event => {
        const position = event.clientX - left
        if (position >= 0 && position <= width) {
          this.percentage = position / width * 100 + '%'
          this.$emit('input', this.percentage)
        }
      }
      document.body.onmouseup = () => {
        this.disabled = false
        document.body.onmousemove = null
        document.body.onmouseup = null
        this.$emit('change', this.percentage)
      }
    },
    horizontalSliderClick () {
      const el = this.$el
      const rect = el.getBoundingClientRect()
      const left = parseInt(rect.left)
      const width = parseInt(rect.width)
      const position = event.clientX - left
      if (position >= 0 && position <= width) {
        const percentage = position / width * 100 + '%'
        this.percentage = percentage
        this.$emit('change', percentage)
      }
    },
    horizontalTooltip () {
      if (!this.tooltip) return
      const el = this.$el
      const rect = el.getBoundingClientRect()
      const left = parseInt(rect.left)
      const width = parseInt(rect.width)
      const position = event.clientX - left
      this.showTooltip = true
      this.$nextTick(() => {
        const tooltipEl = el.querySelector('.slider__tooltip')
        if (!tooltipEl) return
        const tooltipWidthHalf = tooltipEl.clientWidth / 2
        const leftBorder = tooltipWidthHalf
        const rightBorder = width - tooltipWidthHalf
        if (position >= 0 && position <= width) {
          this.tooltipContent = position / width * 100 + '%'
          if (position >= leftBorder && position <= rightBorder) {
            tooltipEl.style.left = position - tooltipWidthHalf + 'px'
          }
        }
      })
    },
    verticalSliderMove () {
      const rect = this.$el.getBoundingClientRect()
      const top = parseInt(rect.top)
      const height = parseInt(rect.height)
      document.body.onmousemove = event => {
        const position = event.clientY - top
        if (position >= 0 && position <= height) {
          this.percentage = (height - position) / height * 100 + '%'
          this.$emit('input', this.percentage)
        }
      }
      document.body.onmouseup = () => {
        document.body.onmouseup = null
        document.body.onmousemove = null
        this.$emit('change', this.percentage)
      }
    },
    verticalSliderClick () {
      const el = this.$el
      const rect = el.getBoundingClientRect()
      const top = parseInt(rect.top)
      const height = parseInt(rect.height)
      const position = event.clientY - top
      if (position >= 0 && position <= height) {
        const percentage = (height - position) / height * 100 + '%'
        this.percentage = percentage
        this.$emit('input', percentage)
      }
    }
  },
  filters: {
    formatPercentage (percentage) {
      return parseInt(percentage) + '%'
    }
  },
  watch: {
    value: {
      handler () {
        if (!this.disabled) {
          this.percentage = this.value
        }
      },
      immediate: true
    }
  }
}
</script>

<style>
.slider {
  position: relative;
  display: flex;
  cursor: pointer;
}
.slider.horizontal {
  align-items: center;
  height: 20px;
  width: 100%;
}
.slider.vertical {
  justify-content: center;
  width: 20px;
  height: 100%;
}
.slider__track {
  position: absolute;
  z-index: 1;
  background-color: rgba(255, 255, 255, .4);
}
.slider.horizontal .slider__track {
  width: 100%;
  height: 2px;
}
.slider.vertical .slider__track {
  width: 3px;
  height: 100%;
}
.slider__progress {
  position: absolute;
  z-index: 2;
  background-color: var(--themeColor);
}
.slider.horizontal .slider__progress {
  width: 0;
  left: 0;
  height: 2px;
}
.slider.vertical .slider__progress {
  bottom: 0;
  width: 3px;
  height: 0;
}
.slider__circle {
  position: absolute;
  width: 10px;
  height: 10px;
  transition: .3s;
  border-radius: 50%;
  background-color: var(--themeColor);
}
.slider.horizontal .slider__circle {
  top: 50%;
  transform: translateY(-50%);
  right: -5px;
}
.slider.vertical .slider__circle {
  left: 50%;
  transform: translateX(-50%);
  top: -5px;
}
.slider:hover .slider__circle {
  width: 15px;
  height: 15px;
}
.slider.horizontal:hover .slider__circle {
  right: -7.5px;
}
.slider.vertical:hover .slider__circle {
  top: -7.5px;
}
.slider__tooltip {
  font-size: 12px;
  color: #fff;
  position: absolute;
}
.slider.horizontal .slider__tooltip {
  bottom: 25px;
  background-color: #000;
  padding: 5px 10px;
  border-radius: 5px;
}
.slider.horizontal .slider__tooltip::after {
  position: absolute;
  content: '';
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-top-color: #000;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
