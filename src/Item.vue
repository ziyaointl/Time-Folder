<template>
  <div class="item">
    <div class="left-column">
      <img src="./assets/minecraft.png" alt="icon" class="item-icon">
    </div>
    <div class="right-column">
      <div class="row">
        <h1>Minecraft.exe</h1>
      </div>
      <div class="row">
        <progress-bar value="50"></progress-bar>
      </div>
      <div class="row">
        <h2 class="info">
          <span>1.24MB/s</span>
          <span>2.34MB/s</span>
          <span>19.2MB of 121MB</span>
          <span>6 mins left</span>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {

      }
    }
  }
</script>