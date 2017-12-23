<template>
  <div id="wrapper">
    <div id="left-pane">
      <div class="pane-title">
        Tools
      </div>
      <ul class="bare pane-menu">
        <li class="active">
          <img :src="icons.brokenLink"> Broken Link Checker
        </li>
        <li>
          <img :src="icons.seoAnalyzer"> SEO Analyzer
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
#wrapper {
  display: flex;
  flex: 1;
}

#left-pane {
  background: #f2f2f2;
  flex: 0 0 300px;
}

#main-pane {
  flex: 1;
}

.pane-title {
  font-size: 2rem;
  line-height: 6rem;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
}

.pane-menu {
  margin-top: 0;
  border-top: 1px solid #eee;

  li {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.2px;
    line-height: 4rem;
    font-weight: 400;
    padding: 0 12px;
    background: #fafafa;
    color: #777;
    border-bottom: 1px solid #eee;
    margin: 0;
    cursor: pointer;

    &.active, &:hover {
      background: white;
      color: #333;
    }

    img {
      float: left;
      height: 1.8rem;
      margin: 14px 8px;
    }
  }
}
</style>

