import Vue from 'vue'
import Router from 'vue-router'

import spells from '@/views/spells'
import units from '@/views/units'
import artifacts from '@/views/artifacts'
import buildings from '@/views/buildings'
import heroes from '@/views/heroes'
import gods from '@/views/gods'
import factions from '@/views/factions'
import infrastructure from '@/views/infrastructure'
import research from '@/views/research'
import census from '@/views/census'
import sorcery from '@/views/sorcery'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: census
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
      path: '/artifacts',
      name: 'artifacts',
      component: artifacts
    },
    {
      path: '/buildings',
      name: 'buildings',
      component: buildings
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: heroes
    },
    {
      path: '/gods',
      name: 'gods',
      component: gods
    },
    {
      path: '/factions',
      name: 'factions',
      component: factions
    },
    {
      path: '/infrastructure',
      name: 'infrastructure',
      component: infrastructure
    },
    {
      path: '/research',
      name: 'research',
      component: research
    },
    {
      path: '/census',
      name: 'census',
      component: census
    },
    {
      path: '/sorcery',
      name: 'sorcery',
      component: sorcery
    }
  ]
})
