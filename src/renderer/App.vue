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
  $color-primary: lighten(#438cc5, 5);
  $size-site-header-height: 60px;
  $color-background-dark: #2c2c2c;
  $color-background-light: #f8f8f8;
  $color-text:  rgb(41, 41, 41);
  $color-headings: #242424;
  $color-default-border: #ededed;
  $color-header-default-background: #f8f8f8;
  $color-footer-default-background: #f8f8f8;
  @import "~mmcss/src/mm";

  body, html {
    font-size: 14px;
  }

  #app {
    min-height: 100vh;
  }

  .menu-item {
    text-align: center;
  }

  .menu-item a {
    opacity: 1;
    line-height: 1;
    text-transform: uppercase;
    font-size: 70%;
    letter-spacing: 1px;

    &:hover {
      opacity: 0.8;
    }
  }

  .menu-item img {
    height: 40px;
    padding: 6px;
    display: block;
  }

  button:disabled,
  button:disabled:hover
  button[disabled],
  button[disabled]:hover{
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
  }
</style>
