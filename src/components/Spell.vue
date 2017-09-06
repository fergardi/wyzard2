<template lang="pug">
  .character
    p dsa
</template>

<script>
  import store from '../vuex/store'
  import i18n from '../services/i18n'
  import firebase from '../services/firebase'

  export default {
    name: 'Character',
    firebase: {
      users: firebase.ref('users')
    },
    filters: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    },
    methods: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .character
    padding 0 10px
</style>
