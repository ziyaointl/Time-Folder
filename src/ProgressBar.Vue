<template>
  <div class="progress-bar">
    <progress class="progress is-small" :value="value" max="100">{{ value }}</progress>
  </div>
</template>

<script>
export default {
  name: 'app',
  props: ['value'],
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import "css/style.scss";
.progress::-webkit-progress-value {
  transition: width 0.3s ease;
}
</style>
