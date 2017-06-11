const Aria2 = window.Aria2 === undefined ? require('aria2') : window.Aria2

let data = {
  host: 'localhost',
  port: 6800,
  secure: false,
  secret: '',
  path: '/jsonrpc'
}

let aria2 = new Aria2(data)

aria2.onopen = function() {
  console.log('aria2 open')
}

aria2.open()

function getFileNameFromPath(path) {
  return path.replace(/^.*[\\\/]/, '')
}

function getName(data) {
  if (data.bittorrent) {
    if (data.bittorrent.info) {
      return data.bittorrent.info.name
    }
  }
  if (data.files[0].path === "") {
    return data.files[0].uris[0].uri
  } else {
    return getFileNameFromPath(data.files[0].path)
  }
}

const store = new Vuex.Store({
  state: {
    currentTab: "All"
  },
  mutations: {
    setCurrentTab(state, value) {
      state.currentTab = value
    }
  }
})

Vue.component('task', {
  template: '#task-template',
  props: ['data'],
  computed: {
    percentFinished() {
      let n = ((this.data.completedLength / this.data.totalLength) * 100).toFixed(2)
      n = parseFloat(n)
      if (n != n) {
        return 0
      }
      return n
    },
    finishedSize() {
      return this.convertToFileSize(this.data.completedLength)
    },
    totalSize() {
      return this.convertToFileSize(this.data.totalLength)
    },
    downloadSpeed() {
      return this.convertToFileSize(this.data.downloadSpeed) + '/s'
    },
    status() {
      let ret = this.data.status;
      if (ret === 'seeding paused') {
        return 'Seeding Paused'
      } else {
        return ret[0].toUpperCase() + ret.substr(1)
      }
    },
    timeRemaining() {
      let remainingBytes = this.data.totalLength - this.data.completedLength
      let remainingSeconds = remainingBytes / this.data.downloadSpeed
      if (remainingSeconds != remainingSeconds || remainingSeconds === Infinity) {
        return Infinity
      } else {
        return this.convertToTime(math.round(remainingSeconds))
      }
    },
    uploadSpeed() {
      if (this.data.uploadSpeed !== undefined) {
        return this.convertToFileSize(this.data.uploadSpeed) + '/s'
      }
      return undefined
    },
    directory() {
      return this.data.dir
    },
    connections() {
      return this.data.connections
    },
    seeders() {
      return this.data.numSeeders
    },
    isSeeding() {
      return this.data.seeder
    },
    name() {
      return getName(this.data)
    },
    metadata() {
      return this.data.following;
    }
  },
  methods: {
    convertToFileSize(num) {
      if (num < 1024) {
        return num + 'B'
      } else if (num < 1024 * 1024) {
        return parseFloat((num / 1024).toFixed(2)) + 'KB'
      } else if (num < 1024 * 1024 * 1024) {
        return parseFloat((num / (1024 * 1024)).toFixed(2)) + 'MB'
      } else if (num < 1024 * 1024 * 1024 * 1024) {
        return parseFloat((num / (1024 * 1024 * 1024)).toFixed(2)) + 'GB'
      } else {
        return parseFloat((num / (1024 * 1024 * 1024 * 1024)).toFixed(2)) + 'TB'
      }
    },
    convertToTime(num) {
      if (num < 60) {
        return num + 's'
      } else if (num < 60 * 60) {
        return math.round(num / 60) + 'min'
      } else if (num < 60 * 60 * 60) {
        return math.round(num / (60 * 60)) + 'h'
      } else {
        return math.round(num / (60 * 60 * 24)) + 'd'
      }
    },
    selectTask(event) {
      let target = event.currentTarget
      if (target.classList.contains("is-selected")) {
        target.classList.remove("is-selected")
      } else {
        target.classList.add("is-selected")
      }
    },
    showInfo(event) {
      event.stopPropagation()
      let icon = event.currentTarget
      let target = event.currentTarget.parentElement.nextElementSibling
      if (target.classList.contains("is-shown")) {
        Velocity(icon, {
          rotateZ: 0
        })
        target.classList.remove("is-shown")
      } else {
        Velocity(icon, {
          rotateZ: 180
        })
        target.classList.add("is-shown")
      }
    }
  }
})

Vue.component('simple-tabs', {
  template: '#simple-tabs-template',
  methods: {
    selectTab(tab) {
      this.$children.forEach(currentTab => {
        if (currentTab.name !== tab.name) {
          currentTab.isActive = false
        } else {
          currentTab.isActive = true
        }
      })
    }
  }
})

Vue.component('simple-tab', {
  template: '#simple-tab-template',
  props: {
    name: {
      required: true
    },
    selected: {
      default: false
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  mounted() {
    this.isActive = this.selected
  }
})

Vue.component('tabs', {
  template: '#tabs-template',
  data() {
    return {
      tabs: []
    }
  },
  created() {
    this.tabs = this.$children
  },
  methods: {
    selectTab(tab) {
      this.tabs.forEach(tempTab => {
        tempTab.isActive = (tempTab.name === tab.name)
      })
      store.commit('setCurrentTab', tab.name)
    }
  }
})

Vue.component('tab', {
  template: '#tab-template',
  props: {
    name: {
      required: true
    },
    selected: {
      default: false
    },
    icon: {
      required: true
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  mounted() {
    this.isActive = this.selected
  }
})

let app = new Vue({
  el: "#app",
  data: {
    url: "",
    specialActive: [],
    waiting: [],
    paused: [],
    specialComplete: [],
    error: [],
    seeding: [],
    seedingPaused: []
  },
  computed: {
    all() {
      return this.active.concat(this.complete);
    },
    currentTab() {
      return store.state.currentTab
    },
    active() {
      return this.specialActive.concat(this.paused.concat(this.waiting.concat(this.error)))
    },
    complete() {
      return this.specialComplete.concat(this.seeding.concat(this.seedingPaused))
    }
  },
  mounted() {
    let vm = this

    aria2.getVersion().then(
      function(res) {
        vm.printNotification(JSON.stringify(res))
      },
      function(err) {
        vm.printNotification(JSON.stringify(err), 'error')
      }
    )

    setInterval(function() {
      vm.updateView()
    }, 500)

  },
  methods: {
    openAddDialog() {
      let el = document.getElementById("addDialog")
      el.classList.add("is-active")
    },
    closeAddDialog() {
      let el = document.getElementById("addDialog")
      el.classList.remove("is-active")
    },
    addLink(url) {
      let vm = this
      aria2.addUri([url]).then(
        function(res) {
          vm.printNotification(JSON.stringify(res))
        },
        function(err) {
          vm.printNotification(JSON.stringify(err), 'error')
        }
      )
      vm.url = ""
      vm.updateView()
      vm.clearSelected()
    },
    printNotification(string, type) {
      if (type === undefined) {
        type = 'alert'
      }
      new Noty({
        type: type,
        layout: 'topRight',
        theme: 'mint',
        timeout: 1000,
        progressBar: true,
        closeWith: ['click'],
        queue: 'global',
        text: string,
        force: false,
        animation: {
          open: function(promise) {
            var n = this;
            Velocity(n.barDom, {
              left: 450,
              scaleY: 2
            }, {
              duration: 0
            });
            Velocity(n.barDom, {
              left: 0,
              scaleY: 1
            }, {
              easing: [8, 8],
              complete: function() {
                promise(function(resolve) {
                  resolve();
                })
              }
            });
          },
          close: function(promise) {
            var n = this;
            Velocity(n.barDom, {
              left: '+=-50'
            }, {
              easing: [8, 8, 2],
              duration: 350
            });
            Velocity(n.barDom, {
              left: 450,
              scaleY: .2,
              height: 0,
              margin: 0
            }, {
              easing: [8, 8],
              complete: function() {
                promise(function(resolve) {
                  resolve();
                })
              }
            });
          }
        }
      }).show();
    },
    updateView() {
      let vm = this
      setTimeout(function() {
        aria2.tellWaiting(0, 1000).then(
          function(res) {
            let pausedTemp = []
            let waitingTemp = []
            let seedingPausedTemp = []
            for (let i = 0; i < res.length; ++i) {
              if (res[i].status === 'paused') {
                if (res[i].seeder === 'true') {
                  res[i].status = 'seeding paused'
                  seedingPausedTemp.push(res[i])
                } else {
                  pausedTemp.push(res[i])
                }
              } else {
                waitingTemp.push(res[i])
              }
            }
            vm.waiting = waitingTemp
            vm.paused = pausedTemp
            vm.seedingPaused = seedingPausedTemp
          },
          function(err) {
            vm.printNotification(JSON.stringify(err), 'error')
          }
        )
        aria2.tellActive([0, 1000]).then(
          function(res) {
            let activeTemp = []
            let seedingTemp = []
            for (let i = 0; i < res.length; ++i) {
              if (res[i].seeder === 'true') {
                res[i].status = 'seeding'
                seedingTemp.push(res[i])
              } else {
                activeTemp.push(res[i])
              }
            }
            vm.specialActive = activeTemp
            vm.seeding = seedingTemp
          },
          function(err) {
            vm.printNotification(JSON.stringify(err), 'error')
          }
        )
        aria2.tellStopped(0, 1000).then(
          function(res) {
            let completeTemp = []
            let errorTemp = []
            for (let i = 0; i < res.length; ++i) {
              if (res[i].status === 'complete') {
                if (!res[i].followedBy) {
                  completeTemp.push(res[i])
                }
              } else {
                errorTemp.push(res[i])
              }
            }
            vm.specialComplete = completeTemp
            vm.error = errorTemp
          },
          function(err) {
            vm.printNotification(JSON.stringify(err), error)
          }
        )
      }, 100)
    },
    deleteTasks() {
      let vm = this
      let targetList = document.getElementsByClassName('task')
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          const status = vm.all[i].status
          if (status === 'active' || status === 'waiting' || status === 'paused') {
            vm.deleteActiveTask(i)
          } else {
            vm.deleteCompletedTask(i)
          }
        }
      }
      vm.updateView()
      vm.clearSelected()
    },
    clearSelected() {
      let targetList = document.getElementsByClassName('is-selected')
      while (targetList.length != 0) {
        targetList[0].classList.remove('is-selected')
      }
    },
    deleteActiveTask(index) {
      let vm = this
      aria2.remove(vm.all[index].gid).then(
        function(res) {
          vm.printNotification('Deleted ' + JSON.stringify(res))
        },
        function(err) {
          vm.printNotification(JSON.stringify(err), 'error')
        }
      )
      vm.deleteCompletedTask(index)
    },
    deleteCompletedTask(index) {
      let vm = this
      aria2.removeDownloadResult(vm.all[index].gid).then(
        function(res) {
          vm.printNotification('Successfully deleted ' + JSON.stringify(res))
        },
        function(err) {
          vm.printNotification(JSON.stringify(err), 'error')
        }
      )
    },
    pauseTasks() {
      let vm = this
      let targetList = document.getElementsByClassName('task')
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          aria2.pause(vm.all[i].gid).then(
            function(res) {
              vm.printNotification('Successfully paused ' + JSON.stringify(res))
            },
            function(err) {
              vm.printNotification(JSON.stringify(err), 'error')
            }
          )
        }
      }
      vm.updateView()
      vm.clearSelected()
    },
    pauseAllTasks() {
      let vm = this
      aria2.pauseAll().then(
        function(res) {
          vm.printNotification('Paused all ' + JSON.stringify(res))
        },
        function(err) {
          vm.printNotification(JSON.stringify(err), 'error')
        }
      )
      vm.clearSelected()
      setTimeout(function() {
        vm.updateView()
      }, 1000)
    },
    resumeTasks() {
      let vm = this
      let targetList = document.getElementsByClassName('task')
      for (let i = 0; i < targetList.length; ++i) {
        if (targetList[i].classList.contains('is-selected')) {
          if (vm.all[i].status === 'error') {
            let url = vm.all[i].files[0].uris[0].uri
            this.deleteCompletedTask(i)
            this.addLink(url)
          } else {
            aria2.unpause(vm.all[i].gid).then(
              function(res) {
                vm.printNotification('Successfully resumed ' + JSON.stringify(res))
              },
              function(err) {
                vm.printNotification(JSON.stringify(err), 'error')
              }
            )
          }
        }
      }
      vm.updateView()
      vm.clearSelected()
    },
    resumeAllTasks() {
      let vm = this
      aria2.unpauseAll().then(
        function(res) {
          vm.printNotification('Resumed all ' + JSON.stringify(res))
        },
        function(err) {
          vm.printNotification(JSON.stringify(err), 'error')
        }
      )
      vm.updateView()
      vm.clearSelected()
    },
    fileChange($event) {
      let vm = this
      let files = $event.target.files
      for (let i = 0; i < files.length; ++i) {
        let reader = new FileReader()
        reader.onload = () => {
          let result = window.btoa(reader.result)
          console.log(result)
          aria2.addTorrent(result).then(
            function(res) {
              vm.printNotification('Added Torrent ' + JSON.stringify(res))
            },
            function(err) {
              vm.printNotification(JSON.stringify(err), 'error')
            }
          )
          vm.updateView()
        }
        reader.readAsBinaryString(files[i])
      }
    }
  }
})
