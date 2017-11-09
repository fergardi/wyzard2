import Vue from 'vue'
import Router from 'vue-router'

// economy
import kingdom from '@/views/economy/kingdom'
import taxes from '@/views/economy/taxes'
import infrastructure from '@/views/economy/infrastructure'
import exploration from '@/views/economy/exploration'
// import world from '@/views/world'
// magic
import dispel from '@/views/magic/dispel'
import meditate from '@/views/magic/meditate'
import relics from '@/views/magic/relics'
import research from '@/views/magic/research'
import sorcery from '@/views/magic/sorcery'
// military
import troops from '@/views/military/troops'
import contracts from '@/views/military/contracts'
import battle from '@/views/military/battle'
import defense from '@/views/military/defense'
// import quests from '@/views/quests'
// diplomacy
import devotion from '@/views/diplomacy/devotion'
import census from '@/views/diplomacy/census'
import tavern from '@/views/diplomacy/tavern'
import messages from '@/views/diplomacy/messages'
import auction from '@/views/diplomacy/auction'
// account
import login from '@/views/account/login'
import settings from '@/views/account/settings'
// knowledge
import help from '@/views/knowledge/help'
import factions from '@/views/knowledge/factions'
import spells from '@/views/knowledge/spells'
import units from '@/views/knowledge/units'
import artifacts from '@/views/knowledge/artifacts'
import buildings from '@/views/knowledge/buildings'
import heroes from '@/views/knowledge/heroes'
import gods from '@/views/knowledge/gods'
// import places from '@/views/knowledge/places'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'index', component: messages },
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
    { path: '/settings', name: 'settings', component: settings },
    { path: '/messages', name: 'messages', component: messages },
    { path: '/meditate', name: 'meditate', component: meditate },
    { path: '/exploration', name: 'exploration', component: exploration },
    { path: '/auction', name: 'auction', component: auction },
    { path: '/contracts', name: 'contracts', component: contracts },
    { path: '/taxes', name: 'taxes', component: taxes },
    { path: '/dispel', name: 'dispel', component: dispel },
    { path: '/troops', name: 'troops', component: troops },
    { path: '/battle', name: 'battle', component: battle },
    { path: '/defense', name: 'defense', component: defense },
    { path: '/help', name: 'help', component: help },
    { path: '/relics', name: 'relics', component: relics },
    // { path: '/quests', name: 'quests', component: quests },
    // { path: '/world', name: 'world', component: world },
    // { path: '/places', name: 'places', component: places }
    { path: '*', redirect: '/' }
  ]
})
