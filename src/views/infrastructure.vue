<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="construction, index in constructions", :key="index")
        building.animated.fadeInUp(:data="construction", :construction="true")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import building from '../components/building'
  
  export default {
    name: 'infrastructure',
    components: {
      'building': building
    },
    created () {
      store.commit('title', 'lbl_title_infrastructure')
    },
    firebase: {
      constructions: firebase.ref('users').child(store.state.username).child('constructions').orderByChild('buildable').equalTo(true)
    }
  }
</script>

<style lang="stylus" scoped>
</style>
