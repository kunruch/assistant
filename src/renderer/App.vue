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
              <button class="button button-ghost" @click="signIn()" v-if="user === null"><i class="la la-google"></i>Sign In</button>
              <div class="user-logged-in" v-if="user !== null" @click="displayUserPofile()">
                <img class="img-user" :src="user.image.url"/>
                <span class="user-name">{{ user.displayName }}</span>
              </div>
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
  import store from './store/store'
  import swal from 'sweetalert2'

  export default {
    name: 'assistant',
    data () {
      return {
        icons: icons,
        user: null
      }
    },
    created () {
      if (store.has('user')) {
        this.user = store.get('user')
      }

      this.$electron.ipcRenderer.on('user-profile-refresh', (event, user) => {
        this.user = user
      })
    },
    beforeDestroy () {
      this.$electron.ipcRenderer.removeAllListeners('user-profile-refresh')
    },
    methods: {
      signIn () {
        this.$electron.ipcRenderer.send('google-auth')
      },
      logout () {
        this.$electron.ipcRenderer.send('google-signout')
      },
      displayUserPofile () {
        swal({
          title: this.user.displayName,
          text: 'Your Google account is connected.',
          imageUrl: this.user.image.url,
          imageWidth: 50,
          imageHeight: 50,
          imageAlt: this.user.displayName,
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: '<i class="la la-close"></i> Disconnect'
        }).then((result) => {
          if (result.dismiss === 'cancel') {
            swal({
              title: 'Are you sure?',
              text: "You won't be able to access data from this Google account unless you sign in again!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, disconnect!'
            }).then((result) => {
              if (result.value) {
                this.logout()
                console.log('logged out')
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "~./../scss/main.scss";

  .user-logged-in {
    cursor: pointer;
  }

  .img-user {
    height: 32px;
    border-radius: 32px;
    margin-top: 16px;
    margin-right: 10px;
    float: left;
  }

  .user-name {
    font-weight: 600;
  }
</style>
