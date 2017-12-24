<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-left">
          <router-link class="site-branding" to="/">
            <img id="logo" src="~@/assets/logo.png" alt="assistant">
            <h1 class="title screen-reader-text">Assistant</h1>
          </router-link>
        </div>
        <div class="menu-toggle">
          <input type="checkbox" id="menu-toggle">
          <label class="header-right" for="menu-toggle"><span class="css-icon-hamburger"><span>Toggle</span></span><span>Menu</span></label>
          <div class="menu-toggle-content">
            <nav role="navigation">
              <ul class="menu">
                <li class="menu-item"><router-link to="/sites"><img :src="icons.sites">Sites</router-link></li>
                <li class="menu-item"><router-link to="/tools"><img :src="icons.tools">Tools</router-link></li>
                <li class="menu-item"><router-link to="/tasks"><img :src="icons.tasks">Tasks</router-link></li>
                <li class="menu-item"><router-link to="/help"><img :src="icons.help">Help</router-link></li>
              </ul>
            </nav>
            <div class="header-right">
            </div>
          </div>
        </div>
      </div>
    </header>
    <main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </main>
  </div>
</template>

<script>
  import icons from './icons'
  export default {
    name: 'assistant',
    data () {
      return {
        icons: icons
      }
    }
  }
</script>

<style lang="scss">
  @import "~./../scss/main.scss";
</style>
