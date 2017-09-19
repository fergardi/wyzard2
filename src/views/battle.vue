<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33")
      mu-card.animated.fadeInUp
        mu-card-text
          p battle
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'battle',
    created () {
      store.commit('title', 'lbl_title_battle')
    },
    firebase: {
      units: firebase.ref('users').child(store.state.username).child('units').orderByChild('name')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
