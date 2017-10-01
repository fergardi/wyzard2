<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="place, index in places", :key="index")
        place-card(:data="place")
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import place from '../../components/place-card'
  
  export default {
    components: {
      'place-card': place
    },
    created () {
      store.commit('title', 'lbl_title_places')
    },
    firebase: {
      places: database.ref('places').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
