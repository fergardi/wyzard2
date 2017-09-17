<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33", v-for="artifact, index in artifacts", :key="index")
      artifact.animated.fadeInUp(:data="artifact")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import artifact from '../components/artifact'
  
  export default {
    name: 'artifacts',
    components: {
      'artifact': artifact
    },
    created () {
      store.commit('title', 'lbl_title_artifacts')
    },
    firebase: {
      artifacts: firebase.ref('artifacts')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
