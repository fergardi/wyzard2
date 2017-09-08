import Vue from 'vue'
import App from './app'
import router from './router'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
import i18n from './services/i18n'
import store from './vuex/store'
import '../node_modules/muse-ui/dist/muse-ui.css'
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
  return number % 1000000
    ? (number / 1000000).toFixed(2) + 'M'
    : number % 1000
      ? (number / 1000).toFixed(2) + 'K'
      : number.toFixed(2)
})
Vue.filter('lorem', () => {
  return 'Muy lejos, más allá de las montañas de palabras...'
})
Vue.filter('ipsum', () => {
  return 'Muy lejos, más allá de las montañas de palabras, alejados de los países de las vocales y las consonantes, viven los textos simulados. Viven aislados en casas de letras, en la costa de la semántica, un gran océano de lenguas. Un riachuelo llamado Pons fluye por su pueblo y los abastece con las normas necesarias. Hablamos de un país paraisomático en el que a uno le caen pedazos de frases asadas en la boca. Ni siquiera los todopoderosos signos de puntuación dominan a los textos simulados; una vida, se puede decir, poco ortográfica.'
})
Vue.filter('translate', (label) => {
  return i18n[store.state.lang][label] || label
})

// production
Vue.config.productionTip = false
// main app
let Main = Vue.component('app', App) // eslint-disable-line
Main = new Main({
  el: '#app',
  router
})
