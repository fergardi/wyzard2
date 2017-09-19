<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="god, index in gods", :key="index")
      god.animated.fadeInUp(:data="god")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import god from '../components/god'
  
  export default {
    name: 'gods',
    components: {
      'god': god
    },
    created () {
      store.commit('title', 'lbl_title_gods')
    },
    firebase: {
      gods: firebase.ref('gods').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
