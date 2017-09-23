<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      building.animated.fadeInUp(:data="village", :tax="true")
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
      store.commit('title', 'lbl_title_levy')
    },
    firebase: {
      village: {
        source: database.ref('users').child(store.state.username).child('constructions').child('village'),
        asObject: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
