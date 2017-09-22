<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="hero, index in heroes", :key="index")
        hero(:data="hero", :contract="true")
</template>

<script>
  import { database } from '../services/firebase'
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
      heroes: database.ref('tavern').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
