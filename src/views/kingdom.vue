<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.kingdom.animated.fadeInUp
        land
</template>

<script>
  import store from '../vuex/store'
  import land from '../components/land'
  
  export default {
    name: 'world',
    components: {
      'land': land
    },
    created () {
      store.commit('title', 'lbl_title_kingdom')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
