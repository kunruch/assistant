<template>
  <div id="content" class="container section">
    <router-link to="/tools">Tools</router-link> > <span class="text-muted">Broken Link Checker</span>
    <input v-model="url" id="url" type="text" placeholder="http://example.com"/>
    <button class="button-primary" @click="beginScan()" :disabled="scanning"><i class="la la-play"></i>
 Begin Scan</button>
    <div>
      <ul class="status bare">
        <li><strong>Status:</strong> <span v-html="status"></span></li>
        <li><strong>Links Checked:</strong> <span v-html="links"></span></li>
        <li><strong>Broken Links:</strong> <span v-html="broken"></span></li>
        <li><strong>Time Elapsed:</strong> <span v-html="time"></span></li>
      </ul>
      <ul id="link-check-output" class="text-small bare">
        <link-checker-item class="item" v-for="links in linkData" :model="links" :key="links.title" ref="links"/>
      </ul>
    </div>
  </div>
</template>


<script>
  import LinkCheckerItem from './components/LinkCheckerItem'

  export default {
    name: 'link-checker',
    components: { LinkCheckerItem },
    data () {
      return {
        scanning: false,
        status: 'Not Running',
        url: 'http://localhost:8080/',
        links: 0,
        broken: 0,
        startTime: null,
        time: '00:00:00',
        linkData: []
      }
    },
    created () {
      this.$electron.ipcRenderer.on('append-linkcheck-page', (event, url) => {
        this.status = 'Running ...'
        this.linkData.push({
          title: url,
          url: url
        })
        this.links++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-page-error', (event, url, error, errorType) => {
        this.status = 'Running ...'
        this.linkData.push({
          title: url,
          url: url,
          status: error,
          displayType: errorType
        })
        this.links++
        this.broken++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-link', (event, link) => {
        this.addChild({ title: link, url: link, status: 'OK', displayType: 'ok' })
        this.links++
      })
      this.$electron.ipcRenderer.on('append-linkcheck-error', (event, link, status) => {
        this.addChild({ title: link, url: link, status: status, displayType: 'error' })
        this.links++
        this.broken++
      })
      this.$electron.ipcRenderer.on('end-linkcheck', (event, message) => {
        this.status = 'Finished'
        this.scanning = false
      })
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('append-linkcheck-page')
      this.$electron.ipcRenderer.removeAllListeners('append-linkcheck-page-error')
      this.$electron.ipcRenderer.removeAllListeners('append-linkcheck-link')
      this.$electron.ipcRenderer.removeAllListeners('append-linkcheck-error')
      this.$electron.ipcRenderer.send('pause-check-links')
    },
    methods: {
      beginScan () {
        this.linkData = []
        this.links = 0
        this.broken = 0
        this.status = 'Starting Scan ...'
        this.scanning = true
        this.startTime = Date.now()
        this.$electron.ipcRenderer.send('check-links', {
          url: this.url
        })
        this.calcTimeElapsed()
      },
      addChild (child) {
        // add child to the last link item
        this.$refs.links[this.$refs.links.length - 1].addChild(child)
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

  #link-check-output {
    border: 1px solid #eee;
  }
</style>