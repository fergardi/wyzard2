import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'

Vue.use(Vuex)

const setUserRef = firebaseAction(({ bindFirebaseRef, unbindFirebaseRef }, { ref }) => {
  bindFirebaseRef('user', ref)
})

const vuex = new Vuex.Store({
  strict: true,
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
    },
    ...firebaseMutations
  },
  actions: {
    user: setUserRef
  }
})

export default vuex
