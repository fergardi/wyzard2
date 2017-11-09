<template lang="pug">
  mu-row
  
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="contracts.length")
      mu-col(v-for="contract, index in contracts", :key="index", width="100", tablet="50", desktop="33")
        hero-card.animated.fadeInUp(:data="contract", :contract="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
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
      store.commit('title', 'lbl_title_contracts')
      store.commit('help', 'txt_help_contracts')
      this.$bindAsArray('contracts', database.ref('users').child(store.state.uid).child('contracts').orderByChild('level'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
