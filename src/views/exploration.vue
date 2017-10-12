<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="66", desktop="50", v-for="building, index in buildings", :key="index")
        building-card.animated.fadeInUp(:data="building", :exploration="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import building from '../components/building-card'
  
  export default {
    components: {
      'building-card': building
    },
    created () {
      store.commit('title', 'lbl_title_explore')
      this.$bindAsArray('buildings', database.ref('users').child(store.state.uid).child('constructions').orderByChild('name').equalTo('lbl_building_terrain'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
