<template>
  <div id="sidebar">
    <div class="sidebar-item is-active">
      <a href="#">
        <h1><i class="ion-home ion-fw"></i>All</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="ion-code-download ion-fw"></i>Active</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="ion-pause ion-fw"></i>Paused</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="ion-checkmark-round ion-fw"></i>Completed</h1>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data() {
      return {}
    }
  }
</script>