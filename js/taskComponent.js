exports.initialize = function() {
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
}
