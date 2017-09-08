<template lang="pug">
  mu-row(gutter)
    mu-col(width="100", tablet="50", desktop="33")
      item(v-for="item, index in items", :key="index", :data="item")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import item from '../components/item'
  
  export default {
    name: 'items',
    components: {
      'item': item
    },
    created () {
      store.commit('title', 'lbl_items')
    },
    firebase: {
      items: firebase.ref('items')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
