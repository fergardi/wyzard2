<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="god, index in gods", :key="index")
        god.animated.fadeInUp(:data="god", :pray="true")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import god from '../components/god'
  
  export default {
    name: 'religion',
    components: {
      'god': god
    },
    created () {
      store.commit('title', 'lbl_title_religion')
    },
    firebase: {
      gods: firebase.ref('gods').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
