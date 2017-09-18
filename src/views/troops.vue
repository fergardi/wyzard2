<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(v-for="unit, index in units", :key="index", width="100", tablet="50", desktop="33")
        unit(:data="unit", :troop="true")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import unit from '../components/unit'
  
  export default {
    name: 'units',
    components: {
      'unit': unit
    },
    created () {
      store.commit('title', 'lbl_title_troops')
    },
    firebase: {
      units: firebase.ref('users').child(store.state.username).child('troops')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
