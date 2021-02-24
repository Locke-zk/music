<template>
  <div class="loading">
    <div class="loading-inner">
      <i class="app app_loading rotate"></i>
      <span>数据加载中...</span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
}
.loading-inner {
  color: var(--themeColor);
  font-size: 12px;
}
.loading-inner span {
  margin-left: 10px;
}
.rotate {
  display: inline-block;
  animation: rotating 2s infinite linear;
}
@keyframes rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
