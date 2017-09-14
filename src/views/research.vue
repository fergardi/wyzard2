<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in spells", :key="index")
      spell(:name="spell['.key']", :turns="spell['.value']", :delay="index + 1")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import spell from '../components/spell'
  
  export default {
    name: 'research',
    components: {
      'spell': spell
    },
    created () {
      store.commit('title', 'lbl_title_research')
      this.$bindAsArray('spells', firebase.ref('users').child(store.state.username).child('researches'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
