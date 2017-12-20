import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/views/LandingPage').default
    },
    {
      path: '/link-checker',
      name: 'link-checker',
      component: require('@/views/LinkChecker').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
