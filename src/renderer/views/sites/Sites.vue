<template>
  <div id="wrapper">
    <left-pane :model="model" :title="title">
      <div class="text-center text-small toolbar" slot="below-title">
        <button class="button button-rounded button-primary" @click="addNewSite()"><i class="la la-plus"></i> Add New</button>
      </div>
    </left-pane>
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
        title: 'Sites',
        model: [
          // { name: 'Overview', icon: 'home', to: '/sites/overview' },
          // { name: 'Localhost', icon: 'sites', to: '/sites/1' },
          // { name: 'New Site', icon: 'new', to: '/sites/new' }
        ]
      }
    },
    created () {
      let sites = this.$store.state.Sites
      this.$store.dispatch('loadSites').then(() => {
        this.model = sites.all
      })
    },
    methods: {
      addNewSite () {
        let sites = this.$store.state.Sites
        let site = { name: 'Localhost', icon: 'sites', url: 'http://localhost:8080', to: '/sites/http://localhost:8080' }
        this.$store.dispatch('addSite', site).then(() => {
          this.model = sites.all
        }, error => {
          console.error(error)
        })
      }
    }
  }
</script>

<style lang="scss">
  .toolbar {
    margin-top: -2rem;
    margin-bottom: 1rem;
  }
</style>

