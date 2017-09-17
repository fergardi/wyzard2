<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="hero, index in heroes", :key="index")
      hero.animated.fadeInUp(:name="hero['.key']")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import hero from '../components/hero'
  
  export default {
    name: 'heroes',
    components: {
      'hero': hero
    },
    created () {
      store.commit('title', 'lbl_title_heroes')
    },
    firebase: {
      heroes: firebase.ref('heroes')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
