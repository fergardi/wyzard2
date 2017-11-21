<template lang="pug">
  mu-row

    mu-col(width="100", tablet="66", desktop="50")
      mu-card.help.animated.fadeInUp
        mu-card-media
          .card-image
            img(v-lazy-load="picture('miscellaneous', 'help')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_help')")
            .card-info
              .card-text {{ 'lbl_label_help' | translate }}
        mu-card-text
          h3.title {{ 'lbl_title_factions' | translate }}
          p(v-html="nl2br(translate('txt_help_factions'))")
          h3.title {{ 'lbl_title_buildings' | translate }}
          p(v-html="nl2br(translate('txt_help_buildings'))")
          h3.title {{ 'lbl_title_spells' | translate }}
          p(v-html="nl2br(translate('txt_help_spells'))")
          h3.title {{ 'lbl_title_units' | translate }}
          p(v-html="nl2br(translate('txt_help_units'))")
          h3.title {{ 'lbl_title_artifacts' | translate }}
          p(v-html="nl2br(translate('txt_help_artifacts'))")
          h3.title {{ 'lbl_title_heroes' | translate }}
          p(v-html="nl2br(translate('txt_help_heroes'))")
          h3.title {{ 'lbl_title_gods' | translate }}
          p(v-html="nl2br(translate('txt_help_gods'))")
</template>

<script>
  import store from '@/vuex/store'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_help')
      store.commit('help', 'txt_help_help')
    }
  }
</script>

<style lang="stylus" scoped>
  .help
    .title
      overflow hidden
      text-align center
      &:before
      &:after
        background-color $gold
        content ""
        display inline-block
        height 1px
        position relative
        vertical-align middle
        width 50%
      &:before
        right 0.5em
        margin-left -50%
      &:after
        left 0.5em
        margin-right -50%
</style>
