<template lang="pug">
  mu-row

    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown", v-if="researches.length")
      mu-col(width="100", tablet="50", desktop="33", v-for="research, index in researches", :key="index")
        spell-card.animated.fadeInUp(:data="research", :investigation="true")
    
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
    created () {
      store.commit('title', 'lbl_title_research')
      store.commit('help', 'txt_help_research')
      this.$bindAsArray('researches', database.ref('users').child(store.state.uid).child('researches').orderByChild('magic'))
    },
    computed: {
      user () {
        return store.state.user
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
