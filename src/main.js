import Vue from 'vue'
import App from './App.vue'

Vue.component('sidebar', require('./Sidebar.vue'))
Vue.component('topbar', require('./Topbar.vue'))
Vue.component('progress-bar', require('./ProgressBar.vue'))

new Vue({
  el: '#app',
  render: h => h(App)
});

