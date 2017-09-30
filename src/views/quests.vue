<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="quest, index in quests", :key="index")
        place.animated.fadeInUp(:data="quest", :adventure="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import place from '../components/place'
  
  export default {
    name: 'quests',
    components: {
      'place': place
    },
    created () {
      store.commit('title', 'lbl_title_quests')
      this.$bindAsArray('quests', database.ref('users').child(store.state.uid).child('quests'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
