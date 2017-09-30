<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="artifact, index in artifacts", :key="index")
        artifact.animated.fadeInUp(:data="artifact")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import artifact from '../components/artifact'
  
  export default {
    name: 'research',
    components: {
      'artifact': artifact
    },
    created () {
      store.commit('title', 'lbl_title_relics')
      this.$bindAsArray('artifacts', database.ref('users').child(store.state.username).child('relics'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
