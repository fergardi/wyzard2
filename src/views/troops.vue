<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(v-for="troop, index in troops", :key="index", width="100", tablet="50", desktop="33")
        unit.animated.fadeInUp(:data="troop", :troop="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import unit from '../components/unit'
  
  export default {
    name: 'troops',
    components: {
      'unit': unit
    },
    created () {
      store.commit('title', 'lbl_title_troops')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('color'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
