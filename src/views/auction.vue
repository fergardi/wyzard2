<template lang="pug">
  mu-row

    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="auctions.length")
      mu-col(width="100", tablet="50", desktop="33", v-for="auction, index in auctions", :key="index")
        artifact-card.animated.fadeInUp(v-if="auction.name.indexOf('artifact') !== -1", :data="auction", :auction="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import artifact from '../components/artifact-card'
  
  export default {
    components: {
      'artifact-card': artifact
    },
    created () {
      store.commit('title', 'lbl_title_auction')
      store.commit('help', 'txt_help_auction')
    },
    firebase: {
      auctions: database.ref('auctions').orderByChild('timestamp')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
