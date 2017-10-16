exports.initialize = function(store) {
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
}
