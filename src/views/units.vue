<template lang="pug">
  mu-row
    mu-col(v-for="unit, index in units", :key="index", width="100", tablet="50", desktop="33")
      unit(:data="unit")
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
      store.commit('title', 'lbl_title_units')
    },
    firebase: {
      units: firebase.ref('units')
    }
  }
</script>

<style lang="stylus" scoped>
  .list
    display flex
    flex-wrap wrap
</style>
