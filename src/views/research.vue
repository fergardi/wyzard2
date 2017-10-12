<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in filtered", :key="index")
        spell-card.animated.fadeInUp(:data="spell", :investigation="true")
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
      store.commit('title', 'lbl_title_research')
      this.$bindAsArray('spells', database.ref('users').child(store.state.uid).child('researches'))
    },
    computed: {
      user () {
        return store.state.user
      },
      filtered () {
        return this.spells.filter(s => !s.completed && s.level <= this.user.magic)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
