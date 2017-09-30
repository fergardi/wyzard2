<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="100", desktop="100", v-for="building, index in buildings", :key="index")
        building.animated.fadeInUp(:data="building", :exploration="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import building from '../components/building'
  
  export default {
    name: 'explore',
    components: {
      'building': building
    },
    created () {
      store.commit('title', 'lbl_title_explore')
      this.$bindAsArray('buildings', database.ref('users').child(store.state.uid).child('constructions').orderByChild('name').equalTo('lbl_building_territory'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
