<template>
  <div id="content" class="container section">
    <router-link to="/tools">Tools</router-link> > <span class="text-muted">Broken Link Checker</span>
    <input v-model="url" id="url" type="text" class="text-small" placeholder="http://example.com"/>
    <button class="text-small" @click="checkLinks()">Check Broken Links</button>
    <pre id="link-check-output" class="text-small" style="height:400px;overfloW:auto" v-html="output"></pre>
  </div>
</template>


<script>
  export default {
    name: 'link-checker',
    data () {
      return {
        url: '',
        output: ''
      }
    },
    created () {
      this.$electron.ipcRenderer.on('append-linkcheck-result', (event, message) => {
        this.output += (message + '\n')
      })
    },
    methods: {
      checkLinks () {
        this.output = ''
        this.$electron.ipcRenderer.send('check-links', {
          url: this.url
        })
      }
    }
  }
</script>


<style>

</style>