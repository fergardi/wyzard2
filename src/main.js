import Vue from 'vue'
import App from './app'
import router from './router/router'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
import i18n from './services/i18n'
import store from './vuex/store'
import moment from 'moment'

import '../node_modules/muse-ui/dist/muse-ui.css'
import '../node_modules/rpg-awesome/css/rpg-awesome.min.css'
import '!style-loader!css-loader!less-loader!./css/theme.less'

// UI
Vue.use(MuseUI)
// firebase
Vue.use(VueFire)
// mapbox
window.mapboxgl = require('mapbox-gl')
// helpers
function numeric (number) {
  return !number
  ? parseFloat(0)
  : number / 1000000000 > 1
    ? parseFloat((number / 1000000000).toFixed(2)).toLocaleString() + ' B'
    : number / 1000000 > 1
      ? parseFloat((number / 1000000).toFixed(2)).toLocaleString() + ' M'
      : number / 1000 > 1
        ? parseFloat((number / 1000).toFixed(2)).toLocaleString() + ' K'
        : parseFloat(number.toFixed(2)).toLocaleString()
}
function datetime (timestamp) {
  return moment(timestamp).fromNow()
}
function translate (label) {
  return i18n[store.state.settings.lang || store.state.lang][label] || label
}
// mixins
Vue.mixin({
  methods: {
    translate (label) {
      return translate(label)
    },
    datetime (timestamp) {
      return datetime(timestamp)
    },
    numeric (number) {
      return numeric(number)
    }
  }
})
// filters
Vue.filter('datetime', (timestamp) => {
  return datetime(timestamp)
})
Vue.filter('numeric', (number) => {
  return numeric(number)
})
Vue.filter('translate', (label) => {
  return translate(label)
})
Vue.filter('ipsum', () => {
  return 'Muy lejos, más allá de las montañas de palabras...'
})
Vue.filter('lorem', () => {
  return 'Muy lejos, más allá de las montañas de palabras, alejados de los países de las vocales y las consonantes, viven los textos simulados. Viven aislados en casas de letras, en la costa de la semántica, un gran océano de lenguas...'
})
// security zone
let open = [
  'login',
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
function opened (route) {
  return open.includes(route)
}
// redirect to home if not logged in
router.beforeEach((to, from, next) => {
  if (!opened(to.name) && !store.state.logged) {
    router.push({ path: '/login' })
  } else {
    return next()
  }
})
// production
Vue.config.productionTip = false
// main app
let Main = Vue.component('app', App) // eslint-disable-line
Main = new Main({
  el: '#app',
  router
})
