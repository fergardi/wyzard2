<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="building, index in buildings", :key="index")
        building-card.animated.fadeInUp(:data="building", :info="true")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import building from '@/components/building-card'
  
  export default {
    components: {
      'building-card': building
    },
    created () {
      store.commit('title', 'lbl_title_buildings')
      store.commit('help', 'txt_help_buildings')
    },
    firebase: {
      buildings: database.ref('buildings').orderByChild('name')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
