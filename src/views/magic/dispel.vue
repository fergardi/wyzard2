<template lang="pug">
  mu-row

    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="dispels.length")
      mu-col(width="100", tablet="50", desktop="33", v-for="enchantment, index in dispels", :key="index")
        spell-card.animated.fadeInUp(:data="enchantment", :breaking="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import spell from '../../components/spell-card'
  
  export default {
    components: {
      'spell-card': spell
    },
    created () {
      store.commit('title', 'lbl_title_dispel')
      store.commit('help', 'txt_help_dispel')
      this.$bindAsArray('enchantments', database.ref('enchantments').orderByChild('remaining'))
    },
    computed: {
      dispels () {
        return this.enchantments.filter(e => e.target === store.state.uid || e.source === store.state.uid)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
