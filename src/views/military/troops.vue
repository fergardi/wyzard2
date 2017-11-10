<template lang="pug">
  mu-row

    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="troops.length")
      mu-col(v-for="troop, index in troops", :key="index", width="100", tablet="50", desktop="33")
        unit-card.animated.fadeInUp(:data="troop", :troop="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import unit from '../../components/unit-card'
  import { addTroopToUser, addRandomTroopToUser } from '../../services/api'
  
  export default {
    components: {
      'unit-card': unit
    },
    created () {
      store.commit('title', 'lbl_title_troops')
      store.commit('help', 'txt_help_troops')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('color'))
      addTroopToUser(store.state.uid, 'phoenix')
      addRandomTroopToUser(store.state.uid, 'undead')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
