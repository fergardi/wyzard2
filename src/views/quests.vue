<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="quest, index in quests", :key="index")
        quest(:data="quest")
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import quest from '../components/quest'
  
  export default {
    name: 'quests',
    components: {
      'quest': quest
    },
    created () {
      store.commit('title', 'lbl_title_quests')
    },
    firebase: {
      quests: firebase.ref('quests')
      // quests: firebase.ref('users').child(store.state.username).child('quests')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
