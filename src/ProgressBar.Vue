<template>
    <progress class="progress is-small" :value="value" max="100">{{ value }}</progress>
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
.progress::-webkit-progress-value {
  transition: width 0.3s ease;
}
</style>
