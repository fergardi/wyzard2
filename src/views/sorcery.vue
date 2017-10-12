<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in book", :key="index")
        spell-card.animated.fadeInUp(:data="spell", :conjuration="true", :users="users")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import spell from '../components/spell-card'
  
  export default {
    components: {
      'spell-card': spell
    },
    created () {
      store.commit('title', 'lbl_title_sorcery')
      this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book'))
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
