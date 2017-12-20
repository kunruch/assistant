<template>
  <div id="content" class="container section">
    <div class="grid">
      <div class="one-half">
        <h2 class="h3">Welcome to your new project!</h2>
        <system-information></system-information>
      </div>

      <div class="one-half">
        <div class="doc">
          <h2 class="h3">Getting Started</h2>
          <p>
            electron-vue comes packed with detailed documentation that covers everything from
            internal configurations, using the project structure, building your application,
            and so much more.
          </p>
           <router-link class="button button-rounded button-primary text-small" to="/link-checker">Broken Link Checker</router-link>
        </div>
        <div class="doc">
          <h3 class="h4">Other Documentation</h3>
          <button class="button button-ghost text-small" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="button button-ghost text-small" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './components/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
</style>
