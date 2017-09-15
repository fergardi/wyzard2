<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="building, index in buildings", :key="index")
      building(:name="building['.key']", :quantity="building['.value']")
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
      this.$bindAsArray('buildings', firebase.ref('users').child(store.state.username).child('buildings'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
