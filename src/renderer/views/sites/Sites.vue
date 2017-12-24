<template>
  <div id="wrapper">
    <left-pane :model="model"></left-pane>
    <div id="main-pane">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
  import LeftPane from '../components/LeftPane'
  export default {
    components: { LeftPane },
    data () {
      return {
        model: {
          title: 'Sites',
          menu: [
            { name: 'Overview', icon: 'home', to: '/sites/overview' },
            { name: 'Localhost', icon: 'sites', to: '/sites/1' },
            { name: 'New Site', icon: 'new', to: '/sites/new' }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
</style>

