import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vuex = new Vuex.Store({
  state: {
    lang: 'es',
    title: 'lbl_wyzard',
    menu: false,
    username: null,
    logged: false,
    settings: {
      lang: 'es',
      navbar: false
    },
    toast: {
      color: null,
      show: false,
      message: null,
      delay: 3000 // milliseconds
    }
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
      state.logged = username !== null
    },
    settings (state, settings) {
      state.settings = settings
    },
    success (state, message) {
      state.toast.color = 'green'
      state.toast.message = message
      state.toast.show = true
    },
    info (state, message) {
      state.toast.color = 'blue'
      state.toast.message = message
      state.toast.show = true
    },
    error (state, message) {
      state.toast.color = 'red'
      state.toast.message = message
      state.toast.show = true
    },
    untoast (state) {
      state.toast.show = false
      state.toast.message = null
    }
  }
})

export default vuex
