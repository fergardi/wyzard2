<template lang="pug">
  mu-row
    mu-col(width="100", tablet="50", desktop="33")
      mu-card.animated.fadeInUp
        mu-card-text
          p help
</template>

<script>
  import store from '../vuex/store'
  
  export default {
    name: 'help',
    created () {
      store.commit('title', 'lbl_title_help')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
