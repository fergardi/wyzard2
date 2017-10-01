<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="artifact, index in artifacts", :key="index")
        artifact-card.animated.fadeInUp(:data="artifact")
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import artifact from '../../components/artifact-card'
  
  export default {
    components: {
      'artifact-card': artifact
    },
    created () {
      store.commit('title', 'lbl_title_artifacts')
    },
    firebase: {
      artifacts: database.ref('artifacts').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
