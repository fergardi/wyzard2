import Vue from 'vue'
import Router from 'vue-router'

import Spells from '@/views/Spells'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Spells
    },
    {
      path: '/spells',
      name: 'spells',
      component: Spells
    }
  ]
})
