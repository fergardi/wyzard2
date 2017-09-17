<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="building, index in buildings", :key="index")
      building.animated.fadeInUp(:data="building")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import building from '../components/building'
  
  export default {
    name: 'buildings',
    components: {
      'building': building
    },
    created () {
      store.commit('title', 'lbl_title_buildings')
    },
    firebase: {
      buildings: firebase.ref('buildings')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
