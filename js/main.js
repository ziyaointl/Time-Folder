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
    message: "",
    acitveDownloads: [],
    pausedDownloads: [],
    url: ""
  },
  mounted() {
    let vm = this;

    aria2.getVersion().then(
      function (res) {
        vm.printString(JSON.stringify(res));
      },
      function (err) {
        vm.printString(JSON.stringify(err));
      }
    );
  },
  methods: {
    openAddDialog() {
      let el = document.getElementById("addDialog");
      el.classList.add("is-active");
    },
    closeAddDialog() {
      let el = document.getElementById("addDialog");
      el.classList.remove("is-active");
    },
    addLink(url) {
      let vm = this;
      aria2.addUri([url]).then(
        function(res) {
          vm.printString(JSON.stringify(res));
        },
        function(err) {
          vm.printString(JSON.stringify(err));
        }
      )
      vm.url = "";
    },
    printString(string) {
      this.message += "<br>" + string;
    }
  }
});
