import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

const setUserRef = firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, { ref }) => {
  bindFirebaseRef('user', ref)
})

const vuex = new Vuex.Store({
  // strict: true,
  state: {
    lang: 'es',
    title: 'lbl_title_wyzard',
    help: 'txt_help_login',
    menu: false,
    popup: false,
    uid: null,
    logged: false,
    settings: {
      lang: 'es',
      navbar: false
    },
    user: null, // firebase user
    toasts: [],
    toast: {
      color: null,
      icon: null,
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
    help (state, help) {
      state.help = help
    },
    uid (state, uid) {
      state.uid = uid
      state.logged = uid !== null
    },
    settings (state, settings) {
      state.settings = settings
    },
    success (state, message) {
      let toast = {
        color: 'green',
        icon: '✔',
        message: message,
        show: true,
        delay: state.toast.delay
      }
      state.toasts.push(toast)
    },
    info (state, message) {
      let toast = {
        color: 'blue',
        icon: '★',
        message: message,
        show: true,
        delay: state.toast.delay
      }
      state.toasts.push(toast)
    },
    error (state, message) {
      let toast = {
        color: 'red',
        icon: '✘',
        message: message,
        show: true,
        delay: state.toast.delay
      }
      state.toasts.push(toast)
    },
    queue (state) {
      if (state.toasts.length > 0) state.toast = state.toasts[0]
    },
    untoast (state) {
      state.toast.show = false
      state.toast.message = null
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => { state.toasts.splice(0, 1) }, 0)
    },
    sos (state) {
      state.popup = !state.popup
    },
    ...firebaseMutations
  },
  actions: {
    user: setUserRef
  }
})

export default vuex
