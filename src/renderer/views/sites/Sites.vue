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
  import swal from 'sweetalert2'

  export default {
    components: { LeftPane },
    data () {
      return {
        title: 'Sites',
        model: []
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
        swal.setDefaults({
          input: 'text',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
          progressSteps: ['1', '2']
        })

        var steps = [
          {
            title: 'Add a Site',
            text: 'Enter Website URL',
            inputPlaceholder: 'https://example.com',
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value.trim().length === 0) {
                  resolve('Please enter a value')
                } else if (!value.startsWith('http://') &&
                      !value.startsWith('https://')) {
                  resolve('Please enter a valid url')
                } else {
                  resolve()
                }
              })
            }
          },
          {
            title: 'Add a Site',
            text: 'Enter Website Name',
            inputPlaceholder: 'My Website',
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value.trim().length === 0) {
                  resolve('Please enter a value')
                } else {
                  resolve()
                }
              })
            }
          }
        ]

        swal.queue(steps).then((result) => {
          swal.resetDefaults()
          if (result.value) {
            let self = this
            let sites = this.$store.state.Sites
            let site = { name: result.value[1], icon: 'sites', url: result.value[0], to: `/sites/view/${result.value[0]}` }
            this.$store.dispatch('addSite', site).then(() => {
              self.model = sites.all
              swal({
                type: 'success',
                title: 'New Site Added',
                showConfirmButton: false,
                timer: 1500
              })
            }, error => {
              swal('Oops..', error.message, 'error')
            })
          }
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

