<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33")
      building.animated.fadeInUp(:data="node", :meditation="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import building from '../components/building'
  
  export default {
    name: 'meditate',
    components: {
      'building': building
    },
    created () {
      store.commit('title', 'lbl_title_meditate')
    },
    firebase: {
      node: {
        source: database.ref('users').child(store.state.username).child('constructions').child('node'),
        asObject: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
