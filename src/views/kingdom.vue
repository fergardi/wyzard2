<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.animated.fadeInUp
        mu-card-media
          img(src="https://i.pinimg.com/736x/4f/24/ce/4f24ce0a235a763bb1a4a110bcbe028a--magic-book-dark-fantasy.jpg", :alt="translate('lbl_label_summary')")
          .card-info
            .card-text {{ 'lbl_label_summary' | translate }}
        mu-card-text
          p summary
</template>

<script>
  import store from '../vuex/store'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_kingdom')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
