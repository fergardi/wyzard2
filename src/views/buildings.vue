<template lang="pug">
  mu-row(gutter)
    mu-col(width="100", tablet="50", desktop="33")
      building(v-for="item, index in items", :key="index", :data="item")
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
      items: firebase.ref('buildings')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
