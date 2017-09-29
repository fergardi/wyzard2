<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        mu-card-media
          img(src="https://i.pinimg.com/736x/4f/24/ce/4f24ce0a235a763bb1a4a110bcbe028a--magic-book-dark-fantasy.jpg")
          .card-info
            .card-title {{ 'lbl_label_help' | translate }}
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
