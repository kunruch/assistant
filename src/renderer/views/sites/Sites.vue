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
            { name: 'Overview', icon: '', to: '/sites/overview' },
            { name: 'New Site', icon: '', to: '/sites/new' }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
</style>

