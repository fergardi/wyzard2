<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="auction, index in auctions", :key="index")
        artifact.animated.fadeInUp(v-if="auction.name.indexOf('artifact') !== -1", :data="auction", :auction="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import artifact from '../components/artifact'
  
  export default {
    name: 'auction',
    components: {
      'artifact': artifact
    },
    created () {
      store.commit('title', 'lbl_title_auction')
    },
    firebase: {
      auctions: database.ref('auctions').orderByChild('gold')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
