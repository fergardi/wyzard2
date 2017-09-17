<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in spells", :key="index")
      spell.animated.fadeInUp(:data="spell", :casting="true", :users="users")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import spell from '../components/spell'
  
  export default {
    name: 'sorcery',
    components: {
      'spell': spell
    },
    created () {
      store.commit('title', 'lbl_title_sorcery')
    },
    firebase: {
      spells: firebase.ref('users').child(store.state.username).child('spells'),
      users: firebase.ref('users')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
