<template lang="pug">
  mu-row
    transition-group(name="card", tag="div", mode="in-out", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="hero, index in heroes", :key="index")
        hero(:name="hero['.key']", :gold="hero.gold", :level="hero.level", :contract="true")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import hero from '../components/hero'
  
  export default {
    name: 'tavern',
    components: {
      'hero': hero
    },
    created () {
      store.commit('title', 'lbl_title_tavern')
    },
    firebase: {
      heroes: firebase.ref('tavern')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
