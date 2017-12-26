<template>
  <div id="wrapper">
    <left-pane :model="model" :title="title"></left-pane>
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
        title: 'Tools',
        model: [
          { name: 'Broken Link Checker', icon: 'brokenLink', to: '/tools/link-checker' },
          { name: 'SEO Analyzer', icon: 'seoAnalyzer', to: '/tools/seo-analyzer' }
        ]
      }
    }
  }
</script>

<style lang="scss">
</style>
