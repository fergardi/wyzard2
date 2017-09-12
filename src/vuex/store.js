import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    lang: 'es',
    title: 'lbl_wyzard',
    menu: false,
    username: 'fergardi',
    delay: 50
  },
  mutations: {
    toggle (state) {
      state.menu = !state.menu
    },
    title (state, title) {
      state.title = title
    },
    username (state, username) {
      state.username = username
    }
  }
})

export default vuex
