<template>
  <div class="clip">
    <div class="clip-inr">
      <div class="clip-lt">
        <el-upload
          v-if="!fileIsUpload"
          drag
          action="#"
          :http-request="uploadFile"
          :show-file-list="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或点击上传</div>
        </el-upload>

        <div class="work-box" v-else>
          <div class="work" :style="imgStyle">
            <img :src="imgContent" :style="imgStyle">

            <div class="mask"></div>

            <div class="rect-box">
              <div class="photo-frame" :style="rectStyle">
                <img :src="imgContent" :style="displayImgStyle">
              </div>

              <div class="rect" :style="rectStyle" @mousedown="move">
                <span class="rect-dot dot-rt" @mousedown.stop="RTMove"></span>
                <span class="rect-dot dot-rb" @mousedown.stop="RBMove"></span>
                <span class="rect-dot dot-lb" @mousedown.stop="LBMove"></span>
                <span class="rect-dot dot-lt" @mousedown.stop="LTMove"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="clip-rt">
        <div class="preview">
          <img
            :src="value"
            v-if="!fileIsUpload"
          >
          <img
            :src="imgContent"
            :style="previewImgStyle"
            id="previewImage"
          >
        </div>
      </div>
    </div>

    <div class="btns">
      <el-button type="primary" @click="clip" :loading="uploading">更新头像</el-button>
      <el-button @click="$refs.uploadNode.click()" v-if="fileIsUpload" :loading="uploading">重新选择</el-button>
      <el-button @click="$emit('close')" :loading="uploading">返回</el-button>
    </div>

    <input type="file" style="display: none" ref="uploadNode" @change="uploadFile({ file: $refs.uploadNode.files[0] })">
  </div>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data () {
    return {
      fileIsUpload: false,
      imgContent: '',
      imgStyle: {
        width: 0,
        height: 0
      },
      rectStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      displayImgStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      previewImgStyle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      previewSize: 126,
      uploading: false
    }
  },
  computed: {
    changelessSide () {
      return parseFloat(this.imgStyle.width) > parseFloat(this.imgStyle.height) ? 'width' : 'height'
    }
  },
  methods: {
    uploadFile ({ file }) {
      if (file) {
        const reader = new FileReader()
        this.fileIsUpload = true
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.imgContent = reader.result
          // 调整图片大小
          const maxWidth = 280
          const maxHeight = 280
          const img = new Image()
          img.src = this.imgContent
          img.onload = () => {
            const sourceRatio = img.width / img.height
            const maxRatio = maxWidth / maxHeight
            let width = 0
            let height = 0
            if (sourceRatio >= maxRatio) {
              if (img.width > maxWidth) {
                width = maxWidth
                height = (img.height * maxWidth) / img.width
              } else {
                width = img.width
                height = img.height
              }
              this.rectStyle.width = this.rectStyle.height = height + 'px'
            } else {
              if (img.height > maxHeight) {
                width = (img.width * maxHeight) / img.height
                height = maxHeight
              } else {
                width = img.width
                height = img.height
              }
              this.rectStyle.width = this.rectStyle.height = width + 'px'
            }
            this.imgStyle.width = this.displayImgStyle.width = width + 'px'
            this.imgStyle.height = this.displayImgStyle.height = height + 'px'
            this.preview()
          }
        }
      }
    },
    move (event) {
      let startPositionX = event.clientX
      let startPositionY = event.clientY
      document.body.onmousemove = event => {
        const positionX = event.clientX
        const positionY = event.clientY
        const rectRect = document.querySelector('.rect').getBoundingClientRect()
        const rectTop = parseInt(rectRect.top)
        const rectRight = parseInt(rectRect.right)
        const rectBottom = parseInt(rectRect.bottom)
        const rectLeft = parseInt(rectRect.left)
        const rectWidth = rectRect.width
        const rectHeight = rectRect.height
        const positionXDiff = positionX - startPositionX
        const positionYDiff = positionY - startPositionY
        const containerRect = document.querySelector('.work').getBoundingClientRect()
        const containerTop = parseInt(containerRect.top)
        const containerRight = parseInt(containerRect.right)
        const containerBottom = parseInt(containerRect.bottom)
        const containerLeft = parseInt(containerRect.left)
        const containerWidth = containerRect.width
        const containerHeight = containerRect.height
        let top = parseInt(this.rectStyle.top) + positionYDiff
        let left = parseInt(this.rectStyle.left) + positionXDiff
        // 上下边界检测
        if (positionYDiff < 0) {
          // top
          if (rectTop <= containerTop) {
            top = 0
          }
        } else {
          // bottom
          if (rectBottom >= containerBottom) {
            top = containerHeight - rectHeight
          }
        }
        // 左右边界检测
        if (positionXDiff < 0) {
          // left
          if (rectLeft <= containerLeft) {
            left = 0
          }
        } else {
          // right
          if (rectRight >= containerRight) {
            left = containerWidth - rectWidth
          }
        }
        this.rectStyle.top = top + 'px'
        this.rectStyle.left = left + 'px'
        this.displayImgStyle.top = -top + 'px'
        this.displayImgStyle.left = -left + 'px'
        this.preview()
        startPositionX = positionX
        startPositionY = positionY
      }
      document.body.onmouseup = () => {
        document.body.onmousemove = null
        document.body.onmouseup = null
      }
    },
    RBMove (event) {
      let startPositionX = event.clientX
      document.body.onmousemove = event => {
        const positionX = event.clientX
        const positionXDiff = positionX - startPositionX
        const rectRect = document.querySelector('.rect').getBoundingClientRect()
        const rectRight = parseInt(rectRect.right)
        const rectBottom = parseInt(rectRect.bottom)
        const rectLeft = parseInt(rectRect.left)
        const containerRect = document.querySelector('.work').getBoundingClientRect()
        const containerRight = parseInt(containerRect.right)
        const containerBottom = parseInt(containerRect.bottom)
        const width = parseFloat(this.rectStyle.width)
        const newRectRight = rectRight + positionXDiff
        const newRectBottom = rectBottom + positionXDiff
        // 边界检测
        if (newRectRight <= containerRight && newRectRight >= rectLeft + 1.1 && newRectBottom <= containerBottom) {
          this.rectStyle.width = this.rectStyle.height = width + positionXDiff + 'px'
          this.preview()
        }
        startPositionX = positionX
      }
      document.body.onmouseup = () => {
        document.body.onmouseup = null
        document.body.onmousemove = null
      }
    },
    LBMove (event) {
      let startPositionX = event.clientX
      document.body.onmousemove = event => {
        const positionX = event.clientX
        const positionXDiff = positionX - startPositionX
        const rectRect = document.querySelector('.rect').getBoundingClientRect()
        const rectLeft = parseInt(rectRect.left)
        const rectRight = parseInt(rectRect.right)
        const rectBottom = parseInt(rectRect.bottom)
        const containerRect = document.querySelector('.work').getBoundingClientRect()
        const containerLeft = parseInt(containerRect.left)
        const containerBottom = parseInt(containerRect.bottom)
        const width = parseFloat(this.rectStyle.width)
        const newRectLeft = rectLeft + positionXDiff
        const newRectBottom = rectBottom - positionXDiff
        // 边界检测
        if (newRectLeft >= containerLeft && newRectLeft <= rectRight - 1.1 && newRectBottom <= containerBottom) {
          const left = parseInt(this.rectStyle.left) + positionXDiff
          this.rectStyle.width = this.rectStyle.height = width - positionXDiff + 'px'
          this.rectStyle.left = left + 'px'
          this.displayImgStyle.left = -left + 'px'
          this.preview()
        }
        startPositionX = positionX
      }
      document.body.onmouseup = () => {
        document.body.onmousemove = null
        document.body.onmouseup = null
      }
    },
    RTMove (event) {
      let startPositionX = event.clientX
      document.body.onmousemove = event => {
        const positionX = event.clientX
        const positionXDiff = positionX - startPositionX
        const rectRect = document.querySelector('.rect').getBoundingClientRect()
        const rectRight = parseInt(rectRect.right)
        const rectLeft = parseInt(rectRect.left)
        const rectTop = parseInt(rectRect.top)
        const containerRect = document.querySelector('.work').getBoundingClientRect()
        const containerRight = parseInt(containerRect.right)
        const containerTop = parseInt(containerRect.top)
        const width = parseFloat(this.rectStyle.width)
        const newRectRight = rectRight + positionXDiff
        const newRectTop = rectTop - positionXDiff
        // 边界检测
        if (newRectRight <= containerRight && newRectRight >= rectLeft + 1.1 && newRectTop >= containerTop) {
          const top = parseInt(this.rectStyle.top) - positionXDiff
          this.rectStyle.width = this.rectStyle.height = width + positionXDiff + 'px'
          this.rectStyle.top = top + 'px'
          this.displayImgStyle.top = -top + 'px'
          this.preview()
        }
        startPositionX = positionX
      }
      document.body.onmouseup = () => {
        document.body.onmouseup = null
        document.body.onmousemove = null
      }
    },
    LTMove (event) {
      let startPositionX = event.clientX
      document.body.onmousemove = event => {
        const positionX = event.clientX
        const positionXDiff = positionX - startPositionX
        const rectRect = document.querySelector('.rect').getBoundingClientRect()
        const rectLeft = parseInt(rectRect.left)
        const rectRight = parseInt(rectRect.right)
        const rectTop = parseInt(rectRect.top)
        const containerRect = document.querySelector('.work').getBoundingClientRect()
        const containerLeft = parseInt(containerRect.left)
        const containerTop = parseInt(containerRect.top)
        const width = parseFloat(this.rectStyle.width)
        const newRectLeft = rectLeft + positionXDiff
        const newRectTop = rectTop + positionXDiff
        // 边界检测
        if (newRectLeft >= containerLeft && newRectLeft <= rectRight - 1.1 && newRectTop >= containerTop) {
          const top = parseInt(this.rectStyle.top) + positionXDiff
          const left = parseInt(this.rectStyle.left) + positionXDiff
          this.rectStyle.width = this.rectStyle.height = width - positionXDiff + 'px'
          this.rectStyle.top = top + 'px'
          this.rectStyle.left = left + 'px'
          this.displayImgStyle.top = -top + 'px'
          this.displayImgStyle.left = -left + 'px'
          this.preview()
        }
        startPositionX = positionX
      }
      document.body.onmouseup = () => {
        document.body.onmouseup = null
        document.body.onmousemove = null
      }
    },
    preview () {
      const ratio = this.previewSize / parseFloat(this.rectStyle.width)
      const width = ratio * parseFloat(this.imgStyle.width)
      const left = -(ratio * parseFloat(this.rectStyle.left))
      const top = -(ratio * parseFloat(this.rectStyle.top))
      this.previewImgStyle.width = width + 'px'
      this.previewImgStyle.height = 'auto'
      this.previewImgStyle.left = left + 'px'
      this.previewImgStyle.top = top + 'px'
    },
    clip () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = this.imgContent
      img.onload = () => {
        let width = 0
        let height = 0
        let x = 0
        let y = 0
        const ratio = parseFloat(this.imgStyle.width) / img.width
        const timeStamp = Date.now()
        const formData = new FormData()
        width = parseFloat(this.rectStyle.width) / ratio
        height = parseFloat(this.rectStyle.height) / ratio
        x = -(parseFloat(this.rectStyle.left) / ratio)
        y = -(parseFloat(this.rectStyle.top) / ratio)
        canvas.width = width
        canvas.height = height
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.drawImage(img, x, y)
        formData.append('avatar', this.base64ToFile(canvas.toDataURL('image/jpeg'), timeStamp + '.jpg'))
        // 上传头像
        this.uploading = true
        fetch(this.$api + '/upload-file', {
          method: 'POST',
          body: formData
        }).then(res => res.json()).then(res => {
          this.$emit('input', res.filePath)
          this.$emit('close')
          this.$message({
            message: '头像上传成功，但未保存！否则不会更新。',
            type: 'warning'
          })
        })
      }
    },
    base64ToFile (base64, filename) {
      const arr = base64.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }
  }
}
</script>

<style scoped>
.clip-inr {
  display: flex;
  padding: 20px 0 50px 0;
}
.btns {
  display: flex;
  justify-content: space-around;
}
.clip-lt {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 450px;
  position: relative;
}
.clip-lt::after {
  position: absolute;
  content: '';
  width: 1px;
  height: 50%;
  background-color: #ddd;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.clip-rt {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex: 1;
}
.preview {
  position: relative;
  width: 126px;
  height: 126px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, .2);
  overflow: hidden;
}
.preview img {
  position: absolute;
  width: 100%;
  height: 100%;
}
.work-box {
  width: 280px;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  overflow: hidden;
  border-radius: 4px;
}
.work {
  position: relative;
}
.mask {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, .7);
}
.rect-box {
  position: absolute;
  z-index: 2;
  top: 0;
  width: 100%;
  height: 100%;
}
.photo-frame {
  position: absolute;
  z-index: 1;
  overflow: hidden;
}
.rect {
  position: absolute;
  z-index: 2;
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: move;
}
.rect-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #fff;
  box-sizing: border-box;
}
.dot-rt {
  right: -10px;
  top: -10px;
  cursor: ne-resize;
}
.dot-rb {
  bottom: -10px;
  right: -10px;
  cursor: se-resize;
}
.dot-lb {
  bottom: -10px;
  left: -10px;
  cursor: sw-resize;
}
.dot-lt {
  top: -10px;
  left: -10px;
  cursor: nw-resize;
}
.photo-frame img {
  position: absolute;
}
</style>
