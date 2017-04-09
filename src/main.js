import Vue from 'vue'
import App from './App.vue'

Vue.component('sidebar', require('./Sidebar.vue'))

new Vue({
  el: '#app',
  render: h => h(App)
});

