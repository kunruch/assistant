<template>
  <div id="content" class="container section">
    <router-link to="/tools">Tools</router-link> > <span class="text-muted">Broken Link Checker</span>
    <input v-model="url" id="url" type="text" placeholder="http://example.com"/>
    <button class="button-primary" @click="beginScan()" :disabled="scanning">Begin Scan</button>
    <div>
      <ul class="status bare">
        <li><strong>Status:</strong> <span v-html="status"></span></li>
        <li><strong>Links Checked:</strong> <span v-html="links"></span></li>
        <li><strong>Broekn Links:</strong> <span v-html="broken"></span></li>
        <li><strong>Time Elapsed:</strong> <span v-html="time"></span></li>
      </ul>
      <div id="link-check-output" class="text-small section" v-html="output"></div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'link-checker',
    data () {
      return {
        scanning: false,
        status: 'Not Running',
        url: 'http://localhost:8080/',
        links: 0,
        broken: 0,
        startTime: null,
        time: '00:00:00',
        output: ''
      }
    },
    created () {
      this.$electron.ipcRenderer.on('append-linkcheck-page', (event, message) => {
        this.status = 'Running ...'
        this.output += `<strong>${message}</strong><br>`
        this.links++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-page-error', (event, message, errorType) => {
        this.status = 'Running ...'
        this.output += `<strong><span class="${errorType}">${message}</span></strong><br>`
        this.links++
        this.broken++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-link', (event, message) => {
        this.output += `<span class="ok">${message}</span><br>`
        this.links++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-error', (event, message) => {
        this.output += `<span class="error">${message}</span><br>`
        this.links++
        this.broken++
      })
      this.$electron.ipcRenderer.on('end-linkcheck', (event, message) => {
        this.status = 'Finished'
      })
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('append-linkcheck-result')
      this.$electron.ipcRenderer.send('pause-check-links')
    },
    methods: {
      beginScan () {
        this.status = 'Starting Scan ...'
        this.scanning = true
        this.startTime = Date.now()
        this.$electron.ipcRenderer.send('check-links', {
          url: this.url
        })
        this.calcTimeElapsed()
      },
      calcTimeElapsed () {
        var sec = (Date.now() - this.startTime) / 1000
        var hours = Math.floor(sec / 3600)
        var minutes = Math.floor((sec - (hours * 3600)) / 60)
        var seconds = Math.round(sec - (hours * 3600) - (minutes * 60))

        if (hours < 10) { hours = '0' + hours }
        if (minutes < 10) { minutes = '0' + minutes }
        if (seconds < 10) { seconds = '0' + seconds }
        this.time = hours + ':' + minutes + ':' + seconds

        if (this.status !== 'Finished') {
          setTimeout(this.calcTimeElapsed, 1000)
        }
      }
    }
  }
</script>


<style lang="scss">
  .status {
    display: flex;

    li {
      margin-right: 1rem;
      flex: 1;
    }
  }

  .ok {
    color: green;
  }

  .error {
    color: red;
  }

  .info {
    color: orange;
  }
</style>