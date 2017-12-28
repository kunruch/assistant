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
    <div class="site-overview">
      <code v-if="false">
        Account: {{ model.analytics.accountId }} webPropertyId: {{ model.analytics.webPropertyId }} profileId: {{ model.analytics.profileId }}
      </code>
      <div class="grid section">
        <div class="one-half">
          <vue-good-table
            title="Page Views"
            perPage="20"
            :columns="analyticsData.pageViews.columns"
            :rows="analyticsData.pageViews.todayData"
            :paginate="true"
            :lineNumbers="false"
            styleClass="table table-bordered table-striped condensed data-table"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import icons from '../../icons'
  import swal from 'sweetalert2'

  export default {
    data () {
      return {
        icons: icons,
        analyticsData: {
          pageViews: {
            columns: [
              {
                label: 'Title',
                field: 'title',
                html: true,
                filterable: false
              },
              {
                label: 'Views',
                field: 'pageViews',
                type: 'number',
                html: false,
                filterable: false
              }
            ],
            todayData: []
          }
        }
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

      // save analytics data if it was updated
      this.$electron.ipcRenderer.on('site-analytics-properties', (event, analytics) => {
        this.$store.dispatch('updateProperty', { id: this.model.id, property: 'analytics', value: analytics })
      })

      // load analytics data if it was updated
      this.$electron.ipcRenderer.on('site-analytics-pageviews', (event, data) => {
        this.analyticsData.pageViews.todayData = data
      })
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('favicon-url')
      this.$electron.ipcRenderer.removeAllListeners('site-analytics-properties')
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
        } else {
          // fetch page views for today
          this.analyticsData.pageViews.todayData = []
          this.$electron.ipcRenderer.send('get-analytics-page-views', this.model, 'today', 'today')
        }
      }
    }
  }
</script>

<style lang="scss">
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

.good-table .responsive {
  overflow-x: auto!important;
}

.data-table {
  font-size: 12px;
  line-height: 1.25;
  margin-top: 0.8rem;
}

.datatable-length {
  display: none!important;
}

.table-header {
  padding: 0 !important;

  .table-title {
    font-size: 14px !important;
  }
}

.table-footer {
  padding: 0!important;
  label, legend, select {
    margin: 0 !important;
  }

  .pagination-controls a span,
  .pagination-controls .info {
    font-size: 12px!important;
  }
}
</style>
