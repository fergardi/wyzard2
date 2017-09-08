<template lang="pug">
  mu-row(gutter)
    mu-col(width="100", tablet="50", desktop="33")
      spell(v-for="spell, index in spells", :key="index", :data="spell")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import spell from '../components/spell'
  
  export default {
    name: 'spells',
    components: {
      'spell': spell
    },
    created () {
      store.commit('title', 'lbl_title_spells')
    },
    firebase: {
      spells: firebase.ref('spells')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
