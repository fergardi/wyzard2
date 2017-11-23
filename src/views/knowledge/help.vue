<template lang="pug">
  mu-row

    mu-col(width="100", tablet="66", desktop="50")
      mu-card.help.animated.fadeInUp
        mu-card-media
          .card-image(v-once)
            img(v-lazy-load="picture('miscellaneous', 'help')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_help')")
          .card-info
            .card-text {{ 'lbl_label_help' | translate }}

        mu-card-text
          .title {{ 'lbl_title_help' | translate }}
          p(v-html="nl2br(translate('txt_help_help'))")
          .title {{ 'lbl_title_factions' | translate }}
          p(v-html="nl2br(translate('txt_help_factions'))")
          .title {{ 'lbl_title_buildings' | translate }}
          p(v-html="nl2br(translate('txt_help_buildings'))")
          .title {{ 'lbl_title_spells' | translate }}
          p(v-html="nl2br(translate('txt_help_spells'))")
          .title {{ 'lbl_title_units' | translate }}
          p(v-html="nl2br(translate('txt_help_units'))")
          .title {{ 'lbl_title_artifacts' | translate }}
          p(v-html="nl2br(translate('txt_help_artifacts'))")
          .title {{ 'lbl_title_heroes' | translate }}
          p(v-html="nl2br(translate('txt_help_heroes'))")
          .title {{ 'lbl_title_gods' | translate }}
          p(v-html="nl2br(translate('txt_help_gods'))")
          .title {{ 'lbl_title_auction' | translate }}
          p(v-html="nl2br(translate('txt_help_auction'))")
          .title {{ 'lbl_title_battle' | translate }}
          p(v-html="nl2br(translate('txt_help_battle'))")
          .title {{ 'lbl_title_census' | translate }}
          p(v-html="nl2br(translate('txt_help_census'))")
          .title {{ 'lbl_title_contracts' | translate }}
          p(v-html="nl2br(translate('txt_help_contracts'))")
          .title {{ 'lbl_title_defense' | translate }}
          p(v-html="nl2br(translate('txt_help_defense'))")
          .title {{ 'lbl_title_devotion' | translate }}
          p(v-html="nl2br(translate('txt_help_devotion'))")
          .title {{ 'lbl_title_dispel' | translate }}
          p(v-html="nl2br(translate('txt_help_dispel'))")
          .title {{ 'lbl_title_exploration' | translate }}
          p(v-html="nl2br(translate('txt_help_exploration'))")
          .title {{ 'lbl_title_infrastructure' | translate }}
          p(v-html="nl2br(translate('txt_help_infrastructure'))")
          .title {{ 'lbl_title_kingdom' | translate }}
          p(v-html="nl2br(translate('txt_help_kingdom'))")
          .title {{ 'lbl_title_meditate' | translate }}
          p(v-html="nl2br(translate('txt_help_meditate'))")
          .title {{ 'lbl_title_messages' | translate }}
          p(v-html="nl2br(translate('txt_help_messages'))")
          .title {{ 'lbl_title_relics' | translate }}
          p(v-html="nl2br(translate('txt_help_relics'))")
          .title {{ 'lbl_title_research' | translate }}
          p(v-html="nl2br(translate('txt_help_research'))")
          .title {{ 'lbl_title_settings' | translate }}
          p(v-html="nl2br(translate('txt_help_settings'))")
          .title {{ 'lbl_title_sorcery' | translate }}
          p(v-html="nl2br(translate('txt_help_sorcery'))")
          .title {{ 'lbl_title_tavern' | translate }}
          p(v-html="nl2br(translate('txt_help_tavern'))")
          .title {{ 'lbl_title_taxes' | translate }}
          p(v-html="nl2br(translate('txt_help_taxes'))")
          .title {{ 'lbl_title_troops' | translate }}
          p(v-html="nl2br(translate('txt_help_troops'))")
        //
          .title {{ 'lbl_title_world' | translate }}
          p(v-html="nl2br(translate('txt_help_world'))")
          .title {{ 'lbl_title_places' | translate }}
          p(v-html="nl2br(translate('txt_help_units'))")
          .title {{ 'lbl_title_quests' | translate }}
          p(v-html="nl2br(translate('txt_help_quests'))")
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
  @import '../../assets/css/colors.styl'

  .help
    .mu-card-text
      margin-top 1em
    .title
      overflow hidden
      text-align center
      font-weight bold
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
