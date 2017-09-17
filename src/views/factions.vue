<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="faction, index in factions", :key="index")
      faction.animated.fadeInUp(:name="faction['.key']")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import faction from '../components/faction'
  
  export default {
    name: 'factions',
    components: {
      'faction': faction
    },
    created () {
      store.commit('title', 'lbl_title_factions')
    },
    firebase: {
      factions: firebase.ref('factions')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
