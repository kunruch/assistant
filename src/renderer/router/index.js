import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/sites',
      component: require('@/views/sites/Sites').default,
      children: [
        {
          path: '',
          redirect: 'overview'
        },
        {
          path: 'overview',
          name: 'sites-overview',
          component: require('@/views/sites/Overview').default
        },
        {
          path: 'new',
          name: 'sites-new',
          component: require('@/views/sites/Sites').default
        }
      ]
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
      redirect: '/sites'
    }
  ]
})
