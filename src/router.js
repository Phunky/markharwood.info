import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/experience',
      name: 'experience',
      component: () => import('./views/Experience.vue')
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('./views/Projects.vue')
    },
    {
      path: '/streams',
      name: 'streams',
      component: () => import('./views/Streams.vue')
    },
    {
      path: '/magic',
      name: 'magic',
      component: () => import('./views/Magic.vue')
    },
    {
      path: '*',
      component: () => import('./views/About.vue')
    }
  ]
})
