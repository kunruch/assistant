<template>
  <div id="wrapper">
    <div id="left-pane">
      <div class="pane-title">
        Sites
      </div>
      <ul class="bare pane-menu">
        <li class="active">
          <img :src="icons.brokenLink"> Overview
        </li>
        <li>
          <img :src="icons.seoAnalyzer"> New Site
        </li>
      </ul>
    </div>
    <div id="main-pane">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
  import icons from '../../icons'
  export default {
    data () {
      return {
        icons: icons
      }
    }
  }
</script>

<style lang="scss">
</style>

