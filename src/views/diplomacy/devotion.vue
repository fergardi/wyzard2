<template lang="pug">
  mu-row
    
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="god, index in gods", :key="index")
        god-card.animated.fadeInUp(:data="god", :pray="true")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import god from '@/components/god-card'
  
  export default {
    components: {
      'god-card': god
    },
    created () {
      store.commit('title', 'lbl_title_devotion')
      store.commit('help', 'txt_help_devotion')
    },
    firebase: {
      gods: database.ref('gods').orderByChild('color')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
