import Vue from 'vue'
import App from './app'
import router from './router/router'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
import i18n from './services/i18n'
import store from './vuex/store'
import moment from 'moment'
import LazyImg from 'v-lazy-img'
import VTooltip from 'v-tooltip'
import { database, auth } from './services/firebase'
// theming
import '../node_modules/muse-ui/dist/muse-ui.css'
import '../node_modules/rpg-awesome/css/rpg-awesome.min.css'
import '!style-loader!css-loader!less-loader!./css/theme.less'
// tooltips
Vue.use(VTooltip, { disposeTimeout: 500 })
// lazy
Vue.use(LazyImg)
// UI
Vue.use(MuseUI)
// firebase
Vue.use(VueFire)
// mapbox
// window.mapboxgl = require('mapbox-gl')
// helpers
const minimize = (number) => {
  return !number
  ? parseFloat(0)
  : Math.abs(number / 1000000000) >= 1
    ? parseFloat((number / 1000000000).toFixed(1)).toLocaleString() + ' B'
    : Math.abs(number / 1000000) >= 1
      ? parseFloat((number / 1000000).toFixed(1)).toLocaleString() + ' M'
      : Math.abs(number / 1000) >= 1
        ? parseFloat((number / 1000).toFixed(1)).toLocaleString() + ' K'
        : parseFloat(number.toFixed(1)).toLocaleString()
}
const numeric = (number) => {
  return !number
  ? parseFloat(0)
  : parseFloat(number.toFixed(1)).toLocaleString()
}
const percentage = (number) => {
  return !number
  ? parseFloat(0) + ' %'
  : parseFloat(Math.floor(number)) + ' %'
}
const timesince = (timestamp) => {
  return moment(timestamp).locale(store.state.user ? store.state.user.settings.lang : store.state.settings.lang).fromNow(true)
}
const datetime = (timestamp) => {
  return moment(timestamp).locale(store.state.user ? store.state.user.settings.lang : store.state.settings.lang).format('LLLL')
}
const translate = (label) => {
  return i18n[store.state.user && store.state.user.settings ? store.state.user.settings.lang : store.state.settings.lang][label] || label
}
const nl2br = (string) => {
  return string.replace(/\r?\n/g, '<br/><br/>')
}
// mixins
Vue.mixin({
  methods: {
    translate (label) {
      return translate(label)
    },
    timesince (timestamp) {
      return timesince(timestamp)
    },
    datetime (timestamp) {
      return datetime(timestamp)
    },
    minimize (number) {
      return minimize(number)
    },
    numeric (number) {
      return numeric(number)
    },
    percentage (number) {
      return percentage(number)
    },
    random (number) {
      let max = number
      let min = max * 0.90 // +- 10%
      return Math.ceil(Math.random() * (max - min + 1) + min)
    },
    nl2br (string) {
      return nl2br(string)
    }
  }
})
// filters
Vue.filter('datetime', (timestamp) => {
  return datetime(timestamp)
})
Vue.filter('timesince', (timestamp) => {
  return timesince(timestamp)
})
Vue.filter('minimize', (number) => {
  return minimize(number)
})
Vue.filter('numeric', (number) => {
  return numeric(number)
})
Vue.filter('percentage', (number) => {
  return percentage(number)
})
Vue.filter('translate', (label) => {
  return translate(label)
})
Vue.filter('nl2br', (string) => {
  return nl2br(string)
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
  if (!opened(to.name) && !store.state.logged) {
    router.push({ path: '/login' })
  } else {
    return next()
  }
})
// production
Vue.config.productionTip = false
// login
const createApp = async () => {
  auth.onAuthStateChanged(status => {
    if (auth.currentUser !== null) {
      store.commit('uid', auth.currentUser.uid)
      store.dispatch('user', database.ref('users').child(store.state.uid))
    }
    // main app
    let Main = Vue.component('app', App) // eslint-disable-line
    Main = new Main({
      el: '#app',
      router
    })
  })
}
// run
createApp()
