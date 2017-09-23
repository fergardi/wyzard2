<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      building.animated.fadeInUp(:data="territory", :exploration="true")
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
    },
    firebase: {
      territory: {
        source: database.ref('users').child(store.state.username).child('constructions').child('territory'),
        asObject: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
