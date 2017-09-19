<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33")
      mu-card.animated.fadeInUp
        mu-card-text
          p defense
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'defense',
    created () {
      store.commit('title', 'lbl_title_defense')
    },
    firebase: {
      spells: firebase.ref('users').child(store.state.username).child('spells').orderByChild('name'),
      artifacts: firebase.ref('users').child(store.state.username).child('artifacts').orderByChild('name')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
