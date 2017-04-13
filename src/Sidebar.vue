<template>
  <div id="sidebar">
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="fa fa-home fa-lg fa-fw"></i>All</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="fa fa-download fa-lg fa-fw"></i>Active</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="fa fa-pause fa-lg fa-fw"></i>Paused</h1>
      </a>
    </div>
    <div class="sidebar-item">
      <a href="#">
        <h1><i class="fa fa-check fa-lg fa-fw"></i>Completed</h1>
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