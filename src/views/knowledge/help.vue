<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.animated.fadeInUp
        mu-card-media
          img(v-lazy-load="picture('miscellaneous', 'help')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_help')")
          .card-info
            .card-text {{ 'lbl_label_help' | translate }}
        mu-card-text
          p help
</template>

<script>
  import store from '../../vuex/store'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_help')
      store.commit('help', 'txt_help_help')
    }
  }
</script>

<style lang="stylus" scoped>
</style>
