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
      path: '/tools',
      component: require('@/views/tools/Tools').default,
      children: [
        {
          path: '',
          redirect: 'link-checker'
        },
        {
          path: 'link-checker',
          name: 'link-checker',
          component: require('@/views/tools/LinkChecker').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
