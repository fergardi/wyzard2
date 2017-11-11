<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.world.animated.fadeIn
        land-card
</template>

<script>
  import store from '@/vuex/store'
  import land from '@/components/land-card'
  
  export default {
    components: {
      'land-card': land
    },
    created () {
      store.commit('title', 'lbl_title_world')
      store.commit('help', 'txt_help_world')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
