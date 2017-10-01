<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="research, index in researches", :key="index")
        spell-card.animated.fadeInUp(:data="research", :conjuration="true", :users="users", :info="true")
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
      this.$bindAsArray('researches', database.ref('users').child(store.state.uid).child('researches').orderByChild('completed').equalTo(true))
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
