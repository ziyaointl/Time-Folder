const Aria2 = window.Aria2;

let data  = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
};

let aria2 = new Aria2(data);

let app = new Vue({
  el: "#app",
  data: {
    message: "Hello",
    acitveDownloads: [],
    pausedDownloads: []
  },
  mounted() {
    let vm = this;

    aria2.getVersion().then(
      function (res) {
        vm.message = res;
      },
      function (err) {
        vm.message = err;
      }
    );
  },
  methods: {
    openAddDialog() {
      
    }
  }
});
