<template lang="pug">
  mu-row(gutter)
    mu-col(width="100", tablet="50", desktop="33")
      unit(v-for="unit, index in units", :key="index", :data="unit")
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
      store.commit('title', 'lbl_units')
    },
    firebase: {
      units: firebase.ref('units')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
