<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in spells", :key="index")
      spell.animated.fadeInUp(:name="spell['.key']")
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
