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
import tavern from '@/views/tavern'
import religion from '@/views/religion'
import kingdom from '@/views/kingdom'
import settings from '@/views/settings'
import messages from '@/views/messages'
import explore from '@/views/explore'
import meditate from '@/views/meditate'
import auction from '@/views/auction'

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
    },
    {
      path: '/tavern',
      name: 'tavern',
      component: tavern
    },
    {
      path: '/religion',
      name: 'religion',
      component: religion
    },
    {
      path: '/kingdom',
      name: 'kingdom',
      component: kingdom
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings
    },
    {
      path: '/messages',
      name: 'messages',
      component: messages
    },
    {
      path: '/meditate',
      name: 'meditate',
      component: meditate
    },
    {
      path: '/explore',
      name: 'explore',
      component: explore
    },
    {
      path: '/auction',
      name: 'auction',
      component: auction
    }
  ]
})
