<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.settings.animated.fadeInUp
        mu-card-text
          form
            mu-checkbox(v-model="user.settings.navbar", :label="translate('lbl_settings_navbar')", @change="update")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'settings',
    created () {
      store.commit('title', 'lbl_title_settings')
    },
    firebase: {
      user: {
        source: firebase.ref('users').child(store.state.username),
        asObject: true
      }
    },
    methods: {
      update () {
        this.$firebaseRefs.user.child('settings').remove()
        this.$firebaseRefs.user.child('settings').set(this.settings)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
