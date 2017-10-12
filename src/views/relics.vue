<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="relic, index in relics", :key="index")
        artifact-card.animated.fadeInUp(:data="relic", :enable="!artifact.battle", :store="true")
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
      store.commit('title', 'lbl_title_relics')
      this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
