<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="enchantment, index in enchantments", :key="index")
        spell.animated.fadeInUp(:data="enchantment", :breaking="true")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import spell from '../components/spell'
  
  export default {
    name: 'sorcery',
    components: {
      'spell': spell
    },
    created () {
      store.commit('title', 'lbl_title_dispel')
      this.$bindAsArray('enchantments', database.ref('users').child(store.state.username).child('enchantments').orderByChild('remaining'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
