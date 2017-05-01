const Aria2 = window.Aria2;

let data  = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
};

let aria2 = new Aria2(data);

Vue.component('task', {
  template: '#task-template',
  props: ['data', 'index']
});

let app = new Vue({
  el: "#app",
  data: {
    message: "",
    url: "",
    active: [],
    waiting: [],
    stopped: [],
    currentTab: "active"
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

    this.updateView();
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
      vm.updateView();
    },
    printString(string) {
      this.message += "<br>" + string;
    },
    updateView() {
      let vm = this;
      setInterval(function() {
        aria2.tellWaiting(0, 1000).then(
          function(res) {
            vm.waiting = res;
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
        aria2.tellActive([0, 1000]).then(
          function(res) {
            vm.active = res;
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
        aria2.tellStopped(0, 1000).then(
          function(res) {
            vm.stopped = res;
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
      }, 1000);
    },
    selectTask(index, event) {
      let target = event.currentTarget;
      if (target.classList.contains("is-selected")) {
        target.classList.remove("is-selected");
      }
      else {
        target.classList.add("is-selected");
      }
    },
    deleteTasks() {
      let vm = this;
      if (vm.currentTab === 'active') {
        let targetList = document.getElementById('active-tasks').childNodes;
        for (let i = 0; i < targetList.length; ++i) {
          if (targetList[i].classList.contains('is-selected')) {
            aria2.remove(vm.active[i].gid).then(
              function(res) {
                vm.printString('Successfully deleted ' + JSON.stringify(res));
              },
              function(err) {
                vm.printString(JSON.stringify(err));
              }
            );
          }
        }
      }
      vm.updateView();
    }
  }
});
