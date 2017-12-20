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
                        <li class="menu-item"><router-link to="/sites">Sites</router-link></li>
                        <li class="menu-item"><router-link to="/tools">Tools</router-link></li>
                        <li class="menu-item"><router-link to="/scheduler">Scheduler</router-link></li>
                        <li class="menu-item"><router-link to="/help">Help</router-link></li>
                    </ul>
                </nav>
                <div class="header-right">
                </div>
            </div>
        </div>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'assistant'
  }
</script>

<style lang="scss">
  $color-primary: #42b983;
  $size-site-header-height: 60px;
  $color-background-dark: #2c2c2c;
  $color-background-light: #f8f8f8;
  $color-text:  rgb(41, 41, 41);
  $color-headings: #2c3e50;
  $color-default-border: #ededed;
  $color-footer-default-background: #f8f8f8;
  @import "~mmcss/src/mm";


  #app {
    background: rgba(229, 229, 229, .2);
    min-height: 100vh;
  }
</style>
