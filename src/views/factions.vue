<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="faction, index in factions", :key="index")
        faction.animated.fadeInUp(:data="faction")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import faction from '../components/faction-card'
  
  export default {
    name: 'factions',
    components: {
      'faction': faction
    },
    created () {
      store.commit('title', 'lbl_title_factions')
    },
    firebase: {
      factions: database.ref('factions').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
