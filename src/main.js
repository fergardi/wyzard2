import Vue from 'vue'
import App from './app'
import router from './router/router'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
import i18n from './services/i18n'
import store from './vuex/store'
import '../node_modules/muse-ui/dist/muse-ui.css'
import '../node_modules/rpg-awesome/css/rpg-awesome.min.css'
// import '../node_modules/muse-ui/dist/theme-light.css'
// import '../node_modules/muse-ui/dist/theme-dark.css'
import '!style-loader!css-loader!less-loader!./css/theme.less'
// UI
Vue.use(MuseUI)
// mapbox
window.mapboxgl = require('mapbox-gl')
// firebase
Vue.use(VueFire)
// filters
Vue.filter('format', (number) => {
  return !number
    ? 0
    : number / 1000000000 > 1
      ? parseFloat((number / 1000000000).toFixed(2)) + 'B'
      : number / 1000000 > 1
        ? parseFloat((number / 1000000).toFixed(2)) + 'M'
        : number / 1000 > 1
          ? parseFloat((number / 1000).toFixed(2)) + 'K'
          : parseFloat(number.toFixed(2))
})
Vue.filter('ipsum', () => {
  return 'Muy lejos, más allá de las montañas de palabras...'
})
Vue.filter('lorem', () => {
  return 'Muy lejos, más allá de las montañas de palabras, alejados de los países de las vocales y las consonantes, viven los textos simulados. Viven aislados en casas de letras, en la costa de la semántica, un gran océano de lenguas...'
})
Vue.filter('translate', (label) => {
  return i18n[store.state.settings.lang || store.state.lang][label] || label
})
// mixins
Vue.mixin({
  methods: {
    translate (label) {
      return i18n[store.state.settings.lang || store.state.lang][label] || label
    }
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
