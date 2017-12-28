<template>
  <div id="content" class="container">
    <div class="site-header">
      <img class="site-icon" v-if="model.favicon" :src="model.favicon"/>
      <img class="site-icon" v-else :src="icons[model.icon]"/>
      <div class="site-desc">
        <h1 class="h3">{{ model.name }}</h1>
        <a class="text-small" href="#" @click="open(model.url)">{{ model.url }}</a>
      </div>
      <p class="text-small pull-right">
        <button class="button button-ghost button-rounded" @click="deleteSite()"><i class="la la-trash"></i> Delete Site</button>
      </p>
    </div>
    <div class="site-overview" v-if="model.analytics">
      Account: {{ model.analytics.accountId }}
      webPropertyId: {{ model.analytics.webPropertyId }}
      profileId: {{ model.analytics.profileId }}
    </div>
  </div>
</template>

<script>
  import icons from '../../icons'
  import swal from 'sweetalert2'

  export default {
    data () {
      return {
        icons: icons
      }
    },
    computed: {
      model () {
        if (this.$store.state.Sites.siteMap[this.$route.params.id]) {
          return this.$store.state.Sites.siteMap[this.$route.params.id]
        } else {
          return {
            name: 'Site Not found',
            url: ''
          }
        }
      }
    },
    watch: {
      // call again the method if the route changes
      '$route': 'loadSiteData'
    },
    created () {
      this.loadSiteData()

      // save favicon data if it was updated
      this.$electron.ipcRenderer.on('favicon-url', (event, favicon, url) => {
        if (this.model.url === url && this.model.favicon !== favicon) {
          this.$store.dispatch('updateProperty', { id: this.model.id, property: 'favicon', value: favicon })
        }
      })

      // save analytics data if it was updted
      this.$electron.ipcRenderer.on('site-analytics-properties', (event, analytics) => {
        this.$store.dispatch('updateProperty', { id: this.model.id, property: 'analytics', value: analytics })
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      deleteSite () {
        swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            this.$store.dispatch('deleteSite', this.model.id).then(() => {
              swal(
                'Deleted!',
                'Your site has been deleted.',
                'success'
              ).then(() => {
                this.$router.push({ name: 'sites-overview' })
              })
            })
          }
        })
      },
      loadSiteData () {
        // fetch favicon everytime, we cache favicon for 24hrs so it is fine
        this.$electron.ipcRenderer.send('fetch-favicon', this.model.url)

        // fetch analytics properties if we don't have one
        if (!this.model.analytics ||
        !this.model.analytics.profileId ||
        this.model.analytics.profileId === '') {
          this.$electron.ipcRenderer.send('find-analytics-properties', this.model.id)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.site-header {
  display: flex;
}

.site-icon {
  float: left;
  width: 48px;
  height: 48px;
  border-radius: 48px;
  margin-top: 1.5rem;
  margin-right: 1rem;
}

.site-desc {
  flex: 1;

  h1 {
    margin-top: 1.5rem;
  }
}

</style>
