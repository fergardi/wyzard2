<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(v-for="unit, index in units", :key="index", width="100", tablet="50", desktop="33")
        unit-card.animated.fadeInUp(:data="unit", :info="true")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import unit from '@/components/unit-card'
  
  export default {
    components: {
      'unit-card': unit
    },
    created () {
      store.commit('title', 'lbl_title_units')
      store.commit('help', 'txt_help_units')
    },
    firebase: {
      units: database.ref('units').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
