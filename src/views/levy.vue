<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33")
      building.animated.fadeInUp(:data="village", :tax="true")
</template>

<script>
  import firebase from '../services/firebase'
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
        source: firebase.ref('users').child(store.state.username).child('buildings').child('village'),
        asObject: true
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
