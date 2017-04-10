<template>
  <div id="sidebar" class="has-text-centered is-clearfix">
    <div>
      <a href="#">
        <span class="icon"><i class="fa fa-home"></i><p>All</p></span>
      </a>
    </div>
    <div>
      <a href="#">
        <span class="icon"><i class="fa fa-home"></i><p>Active</p></span>
      </a>
    </div>
    <div>
    <a href="#">
      <span class="icon"><i class="fa fa-home"></i><p>Completed</p></span>
    </a>
    </div>
    <div>
    <a href="#">
      <span class="icon"><i class="fa fa-pause"></i><p class="option">Paused</p></span>
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
  #sidebar {
    height: 100%;
    width: 200px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #333;
    overflow: hidden;
    padding-top: 60px;
    transition: .5s;
  }

  a {
    color: white;
  }
</style>