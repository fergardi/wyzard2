<template lang="pug">
  mu-row

    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="book.length")
      mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in book", :key="index")
        spell-card.animated.fadeInUp(:data="spell", :conjuration="true")

    mu-col(width="100", tablet="50", desktop="33", v-else)
      mu-card.empty.animated.fadeInUp
        mu-card-text
          p.card-description {{ 'txt_help_empty' | translate }}
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import spell from '@/components/spell-card'
  
  export default {
    components: {
      'spell-card': spell
    },
    async created () {
      store.commit('title', 'lbl_title_sorcery')
      store.commit('help', 'txt_help_sorcery')
      await this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book').orderByChild('magic'))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
