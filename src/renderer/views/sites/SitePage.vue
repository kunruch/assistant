<template>
  <div id="content" class="container">
    <div class="site-desc">
      <h1 class="h3">{{ model.name }}</h1>
      <a class="text-small" href="model.url">{{ model.url }}</a>
    </div>
    <div class="site-overview">
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      model () {
        console.log(this.$route.params.id)
        console.dir(this.$store.state.Sites.siteMap)
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
    created () {
    }
  }
</script>