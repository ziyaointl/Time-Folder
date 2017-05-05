const Aria2 = window.Aria2;

let data  = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
};

let aria2 = new Aria2(data);

const store = new Vuex.Store({
  state: {
    currentTab: "All"
  },
  mutations: {
    setCurrentTab(state, value) {
      state.currentTab = value;
    }
  }
})

Vue.component('task', {
  template: '#task-template',
  props: ['data'],
  computed: {
    percentFinished() {
      let n = ((this.data.completedLength / this.data.totalLength) * 100).toFixed(2);
      n = parseFloat(n);
      if (n != n)  {
        return 0;
      }
      return n;
    },
    finishedSize() {
      return this.convertToFileSize(this.data.completedLength);
    },
    totalSize() {
      return this.convertToFileSize(this.data.totalLength);
    }
  },
  methods: {
    convertToFileSize(num) {
      if (num < 1024) {
        return num + 'B';
      }
      else if (num < 1024*1024) {
        return parseFloat((num / 1024).toFixed(2)) + 'KB';
      }
      else if (num < 1024*1024*1024) {
        return parseFloat((num / (1024*1024)).toFixed(2)) + 'MB';
      }
      else if (num < 1024*1024*1024*1024) {
        return parseFloat((num / (1024*1024*1024)).toFixed(2)) + 'GB';
      }
      else {
        return parseFloat((num / (1024*1024*1024*1024)).toFixed(2)) + 'TB';
      }
    }
  }
});

Vue.component('tabs', {
  template: '#tabs-template',
  data() {
    return {
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(tab) {
      this.tabs.forEach(tempTab => {
        tempTab.isActive = (tempTab.name === tab.name);
      });
      store.commit('setCurrentTab', tab.name);
    }
  }
});

Vue.component('tab', {
  template: '#tab-template',
  props: {
    name: { required: true },
    selected: { default: false },
    icon: {}
  },
  data() {
    return {
      isActive: false
    }
  },
  mounted() {
    this.isActive = this.selected;
  }
})

let app = new Vue({
  el: "#app",
  data: {
    message: "",
    url: "",
    active: [],
    waiting: [],
    stopped: []
  },
  computed: {
    all() {
      return this.active.concat(this.waiting.concat(this.stopped));
    },
    currentTab() {
      return store.state.currentTab;
    }
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

    // setInterval(function() {
    //   vm.updateView();
    // }, 500);

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
      setTimeout(function() {
        aria2.tellWaiting(0, 1000).then(
          function(res) {
            vm.waiting = res;
            vm.appendFileName(vm.waiting);
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
        aria2.tellActive([0, 1000]).then(
          function(res) {
            vm.active = res;
            vm.appendFileName(vm.active);
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
        aria2.tellStopped(0, 1000).then(
          function(res) {
            vm.stopped = res;
            vm.appendFileName(vm.stopped);
          },
          function(err) {
            vm.printString(JSON.stringify(err));
          }
        );
      }, 100);
      vm.clearSelected();
    },
    selectTask(event) {
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
      let targetList = document.getElementsByClassName('task');
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          const status = vm.all[i].status;
          if (status === 'active' || status === 'waiting' || status === 'paused') {
            vm.deleteActiveTask(i);
          } else {
            vm.deleteCompletedTask(i);
          }
        }
      }
      vm.updateView();
    },
    clearSelected() {
      let targetList = document.getElementsByClassName('is-selected');
      while (targetList.length != 0) {
        targetList[0].classList.remove('is-selected');
      }
    },
    deleteActiveTask(index) {
      let vm = this;
      aria2.remove(vm.all[index].gid).then(
        function(res) {
          vm.printString('Successfully deleted ' + JSON.stringify(res));
        },
        function(err) {
          vm.printString(JSON.stringify(err));
        }
      );
      vm.deleteCompletedTask(index);
    },
    deleteCompletedTask(index) {
      let vm = this;
      aria2.removeDownloadResult(vm.all[index].gid).then(
        function(res) {
          vm.printString('Successfully deleted ' + JSON.stringify(res));
        },
        function(err) {
          vm.printString(JSON.stringify(err));
        }
      );
    },
    pauseTasks() {
      let vm = this;
      let targetList = document.getElementsByClassName('task');
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          aria2.pause(vm.all[i].gid).then(
            function(res) {
              vm.printString('Successfully paused ' + JSON.stringify(res));
            },
            function(err) {
              vm.printString(JSON.stringify(err));
            }
          );
        }
      }
      vm.updateView();
    },
    pauseAllTasks() {
      let vm = this;
      aria2.pauseAll().then(
        function(res) {
          vm.printString('Paused all ' + JSON.stringify(res));
        },
        function(err) {
          vm.printString(JSON.stringify(err));
        }
      );
      setTimeout(function() {
        vm.updateView();
      }, 1000);
    },
    resumeTasks() {
      let vm = this;
      let targetList = document.getElementsByClassName('task');
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          aria2.unpause(vm.all[i].gid).then(
            function(res) {
              vm.printString('Successfully resumed ' + JSON.stringify(res));
            },
            function(err) {
              vm.printString(JSON.stringify(err));
            }
          );
        }
      }
      vm.updateView();
    },
    resumeAllTasks() {
      let vm = this;
      aria2.unpauseAll().then(
        function(res) {
          vm.printString('Resumed all ' + JSON.stringify(res));
        },
        function(err) {
          vm.printString(JSON.stringify(err));
        }
      );
      vm.updateView();
    },
    appendFileName(data) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i].files[0].path === "") {
          data[i].taskName = data[i].files[0].uris[0].uri;
        } else {
          data[i].taskName = this.getFileNameFromPath(data[i].files[0].path)
        }
      }
    },
    getFileNameFromPath(path) {
      return path.replace(/^.*[\\\/]/, '');
    }
  }
});
