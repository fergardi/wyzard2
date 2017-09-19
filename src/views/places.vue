<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="place, index in places", :key="index")
        place(:data="place")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import place from '../components/place'
  
  export default {
    name: 'places',
    components: {
      'place': place
    },
    created () {
      store.commit('title', 'lbl_title_places')
    },
    firebase: {
      places: firebase.ref('places').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
