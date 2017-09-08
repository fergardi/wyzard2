import Vue from 'vue'
import Router from 'vue-router'

import spells from '@/views/spells'
import units from '@/views/units'
import items from '@/views/items'
import buildings from '@/views/buildings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: spells
    },
    {
      path: '/spells',
      name: 'spells',
      component: spells
    },
    {
      path: '/units',
      name: 'units',
      component: units
    },
    {
      path: '/items',
      name: 'items',
      component: items
    },
    {
      path: '/buildings',
      name: 'buildings',
      component: buildings
    }
  ]
})
