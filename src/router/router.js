import Vue from 'vue'
import Router from 'vue-router'

import spells from '@/views/knowledge/spells'
import units from '@/views/knowledge/units'
import artifacts from '@/views/knowledge/artifacts'
import buildings from '@/views/knowledge/buildings'
import heroes from '@/views/knowledge/heroes'
import gods from '@/views/knowledge/gods'
import factions from '@/views/knowledge/factions'
import places from '@/views/knowledge/places'
import infrastructure from '@/views/infrastructure'
import relics from '@/views/relics'
import research from '@/views/research'
import census from '@/views/census'
import sorcery from '@/views/sorcery'
import tavern from '@/views/tavern'
import devotion from '@/views/devotion'
import domains from '@/views/domains'
import kingdom from '@/views/kingdom'
import settings from '@/views/settings'
import messages from '@/views/messages'
import exploration from '@/views/exploration'
import meditate from '@/views/meditate'
import auction from '@/views/auction'
import taxes from '@/views/taxes'
import dispel from '@/views/dispel'
import quests from '@/views/quests'
import troops from '@/views/troops'
import contracts from '@/views/contracts'
import battle from '@/views/battle'
import defense from '@/views/defense'
import help from '@/views/help'
import login from '@/views/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'index', component: login },
    { path: '/login', name: 'login', component: login },
    { path: '/spells', name: 'spells', component: spells },
    { path: '/units', name: 'units', component: units },
    { path: '/artifacts', name: 'artifacts', component: artifacts },
    { path: '/buildings', name: 'buildings', component: buildings },
    { path: '/heroes', name: 'heroes', component: heroes },
    { path: '/gods', name: 'gods', component: gods },
    { path: '/factions', name: 'factions', component: factions },
    { path: '/infrastructure', name: 'infrastructure', component: infrastructure },
    { path: '/research', name: 'research', component: research },
    { path: '/census', name: 'census', component: census },
    { path: '/sorcery', name: 'sorcery', component: sorcery },
    { path: '/tavern', name: 'tavern', component: tavern },
    { path: '/devotion', name: 'devotion', component: devotion },
    { path: '/kingdom', name: 'kingdom', component: kingdom },
    { path: '/domains', name: 'domains', component: domains },
    { path: '/settings', name: 'settings', component: settings },
    { path: '/messages', name: 'messages', component: messages },
    { path: '/meditate', name: 'meditate', component: meditate },
    { path: '/exploration', name: 'exploration', component: exploration },
    { path: '/auction', name: 'auction', component: auction },
    { path: '/contracts', name: 'contracts', component: contracts },
    { path: '/taxes', name: 'taxes', component: taxes },
    { path: '/dispel', name: 'dispel', component: dispel },
    { path: '/quests', name: 'quests', component: quests },
    { path: '/places', name: 'places', component: places },
    { path: '/troops', name: 'troops', component: troops },
    { path: '/battle', name: 'battle', component: battle },
    { path: '/defense', name: 'defense', component: defense },
    { path: '/help', name: 'help', component: help },
    { path: '/relics', name: 'relics', component: relics }
  ]
})
