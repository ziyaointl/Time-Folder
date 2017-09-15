exports.hello = function() {
  const taskComponent = require('./taskComponent.js')
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

  //Get name of a given task
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

  //Initialize VueX
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

  taskComponent.initialize()

  Vue.component('horizontal-tabs', {
    template: '#horizontal-tabs-template',
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

  Vue.component('horizontal-tab', {
    template: '#horizontal-tab-template',
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
            vm.printNotification('Added URL: ' + url)
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
          timeout: 2000,
          progressBar: false,
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
        let name = getName(vm.all[index])
        aria2.remove(vm.all[index].gid).then(
          function(res) {
            vm.printNotification('Deleted ' + name)
          },
          function(err) {
            // vm.printNotification(JSON.stringify(err), 'error')
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
            // vm.printNotification(JSON.stringify(err), 'error')
          }
        )
      },
      pauseTasks() {
        let vm = this
        let targetList = document.getElementsByClassName('task')
        for (let i = 0; i < targetList.length; ++i) {
          if (targetList[i].classList.contains('is-selected')) {
            let name = getName(vm.all[i])
            aria2.pause(vm.all[i].gid).then(
              function(res) {
                vm.printNotification('Pausing ' + name)
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
            vm.printNotification('Pausing all active tasks (including seeding ones)')
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

}
