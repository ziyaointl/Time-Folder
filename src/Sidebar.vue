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

<style lang="scss">
  $frost-blue: #669BBC;

  #sidebar {
    height: 100%;
    width: 220px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #333;
    overflow: hidden;
    padding-top: 40px;
    transition: .5s;
  }

  a {
    color: white;
  }

  i {
    margin-right: 10px; 
  }
  
  .sidebar-item {
    padding: 10px;
    padding-left: 40px;
    border-left: solid;
    border-color: #333;
  }

  .sidebar-item:active {
    background: #444;
    border-color: $frost-blue;
  }

  .sidebar-item:active h1 {
    color: #fff;
  }

  .sidebar-item:hover h1 {
    color: white;
  }
</style>