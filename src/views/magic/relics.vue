<template lang="pug">
  mu-row
  
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="relics.length")
      mu-col(width="100", tablet="50", desktop="33", v-for="relic, index in relics", :key="index")
        artifact-card.animated.fadeInUp(:data="relic", :enable="true", :store="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import artifact from '@/components/artifact-card'
  
  export default {
    components: {
      'artifact-card': artifact
    },
    async created () {
      store.commit('title', 'lbl_title_relics')
      store.commit('help', 'txt_help_relics')
      await this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
