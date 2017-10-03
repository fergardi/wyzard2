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
    title: 'lbl_wyzard',
    menu: false,
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
        message: message,
        show: true
      }
      state.toasts.push(toast)
    },
    info (state, message) {
      let toast = {
        color: 'blue',
        message: message,
        show: true
      }
      state.toasts.push(toast)
    },
    error (state, message) {
      let toast = {
        color: 'red',
        message: message,
        show: true
      }
      state.toasts.push(toast)
    },
    untoast (state) {
      state.toast.show = false
      state.toast.message = null
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => { state.toasts.splice(0, 1) }, 0)
    },
    ...firebaseMutations
  },
  actions: {
    user: setUserRef
  }
})

export default vuex
