import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'index', component: () => import('@/views/diplomacy/messages') },
    { path: '/login', name: 'login', component: () => import('@/views/account/login') },
    { path: '/spells', name: 'spells', component: () => import('@/views/knowledge/spells') },
    { path: '/units', name: 'units', component: () => import('@/views/knowledge/units') },
    { path: '/artifacts', name: 'artifacts', component: () => import('@/views/knowledge/artifacts') },
    { path: '/buildings', name: 'buildings', component: () => import('@/views/knowledge/buildings') },
    { path: '/heroes', name: 'heroes', component: () => import('@/views/knowledge/heroes') },
    { path: '/gods', name: 'gods', component: () => import('@/views/knowledge/gods') },
    { path: '/factions', name: 'factions', component: () => import('@/views/knowledge/factions') },
    { path: '/infrastructure', name: 'infrastructure', component: () => import('@/views/economy/infrastructure') },
    { path: '/research', name: 'research', component: () => import('@/views/magic/research') },
    { path: '/census', name: 'census', component: () => import('@/views/diplomacy/census') },
    { path: '/sorcery', name: 'sorcery', component: () => import('@/views/magic/sorcery') },
    { path: '/tavern', name: 'tavern', component: () => import('@/views/diplomacy/tavern') },
    { path: '/devotion', name: 'devotion', component: () => import('@/views/diplomacy/devotion') },
    { path: '/kingdom', name: 'kingdom', component: () => import('@/views/economy/kingdom') },
    { path: '/settings', name: 'settings', component: () => import('@/views/account/settings') },
    { path: '/messages', name: 'messages', component: () => import('@/views/diplomacy/messages') },
    { path: '/meditate', name: 'meditate', component: () => import('@/views/magic/meditate') },
    { path: '/exploration', name: 'exploration', component: () => import('@/views/economy/exploration') },
    { path: '/auction', name: 'auction', component: () => import('@/views/diplomacy/auction') },
    { path: '/contracts', name: 'contracts', component: () => import('@/views/military/contracts') },
    { path: '/taxes', name: 'taxes', component: () => import('@/views/economy/taxes') },
    { path: '/dispel', name: 'dispel', component: () => import('@/views/magic/dispel') },
    { path: '/troops', name: 'troops', component: () => import('@/views/military/troops') },
    { path: '/battle', name: 'battle', component: () => import('@/views/military/battle') },
    { path: '/defense', name: 'defense', component: () => import('@/views/military/battle') },
    { path: '/help', name: 'help', component: () => import('@/views/knowledge/help') },
    { path: '/relics', name: 'relics', component: () => import('@/views/magic/relics') },
    // { path: '/quests', name: 'quests', component: () => import() quests },
    // { path: '/world', name: 'world', component: () => import() world },
    // { path: '/places', name: 'places', component: () => import() places }
    { path: '*', redirect: '/' }
  ]
})

// security zone
let open = [
  'login',
  'help',
  'gods',
  'artifacts',
  'settings',
  'buildings',
  'factions',
  'heroes',
  'places',
  'spells',
  'units'
]

const opened = (route) => {
  return open.includes(route)
}

// redirect to home if not logged in
router.beforeEach((to, from, next) => {
  if (!opened(to.name)) {
    /*
    if (auth.currentUser && !auth.currentUser.isEmailVerified) {
      store.commit('info', 'auth/verification-required')
      router.push({ path: '/login' })
      return
    }
    */
    if (!store.state.logged) {
      // store.commit('success', 'auth/authentication-required')
      router.push({ path: '/login' })
      return
    }
  }
  return next()
})

export default router
