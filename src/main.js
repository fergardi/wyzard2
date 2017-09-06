import Vue from 'vue'
import App from './app'
import router from './router'
import VueFire from 'vuefire'
import MuseUI from 'muse-ui'
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
Vue.filter('lorem', () => {
  return 'Muy lejos, más allá de las montañas de palabras...'
})
// filters
Vue.filter('ipsum', () => {
  return 'Muy lejos, más allá de las montañas de palabras, alejados de los países de las vocales y las consonantes, viven los textos simulados. Viven aislados en casas de letras, en la costa de la semántica, un gran océano de lenguas. Un riachuelo llamado Pons fluye por su pueblo y los abastece con las normas necesarias. Hablamos de un país paraisomático en el que a uno le caen pedazos de frases asadas en la boca. Ni siquiera los todopoderosos signos de puntuación dominan a los textos simulados; una vida, se puede decir, poco ortográfica.'
})

// production
Vue.config.productionTip = false
// main app
let Main = Vue.component('app', App) // eslint-disable-line
Main = new Main({
  el: '#app',
  router
})
