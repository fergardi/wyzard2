<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="hero, index in heroes", :key="index")
        hero-card.animated.fadeInUp(:data="hero", :info="true")
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import hero from '../../components/hero-card'
  
  export default {
    components: {
      'hero-card': hero
    },
    created () {
      store.commit('title', 'lbl_title_heroes')
      store.commit('help', 'txt_help_heroes')
    },
    firebase: {
      heroes: database.ref('heroes').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
