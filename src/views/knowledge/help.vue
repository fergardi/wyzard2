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
          h3.title {{ 'lbl_title_help' | translate }}
          p(v-html="nl2br(translate('txt_help_help'))")
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
          h3.title {{ 'lbl_title_auction' | translate }}
          p(v-html="nl2br(translate('txt_help_auction'))")
          h3.title {{ 'lbl_title_battle' | translate }}
          p(v-html="nl2br(translate('txt_help_battle'))")
          h3.title {{ 'lbl_title_census' | translate }}
          p(v-html="nl2br(translate('txt_help_census'))")
          h3.title {{ 'lbl_title_contracts' | translate }}
          p(v-html="nl2br(translate('txt_help_contracts'))")
          h3.title {{ 'lbl_title_defense' | translate }}
          p(v-html="nl2br(translate('txt_help_defense'))")
          h3.title {{ 'lbl_title_devotion' | translate }}
          p(v-html="nl2br(translate('txt_help_devotion'))")
          h3.title {{ 'lbl_title_dispel' | translate }}
          p(v-html="nl2br(translate('txt_help_dispel'))")
          h3.title {{ 'lbl_title_exploration' | translate }}
          p(v-html="nl2br(translate('txt_help_exploration'))")
          h3.title {{ 'lbl_title_infrastructure' | translate }}
          p(v-html="nl2br(translate('txt_help_infrastructure'))")
          h3.title {{ 'lbl_title_kingdom' | translate }}
          p(v-html="nl2br(translate('txt_help_kingdom'))")
          h3.title {{ 'lbl_title_meditate' | translate }}
          p(v-html="nl2br(translate('txt_help_meditate'))")
          h3.title {{ 'lbl_title_messages' | translate }}
          p(v-html="nl2br(translate('txt_help_messages'))")
          h3.title {{ 'lbl_title_relics' | translate }}
          p(v-html="nl2br(translate('txt_help_relics'))")
          h3.title {{ 'lbl_title_research' | translate }}
          p(v-html="nl2br(translate('txt_help_research'))")
          h3.title {{ 'lbl_title_settings' | translate }}
          p(v-html="nl2br(translate('txt_help_settings'))")
          h3.title {{ 'lbl_title_sorcery' | translate }}
          p(v-html="nl2br(translate('txt_help_sorcery'))")
          h3.title {{ 'lbl_title_tavern' | translate }}
          p(v-html="nl2br(translate('txt_help_tavern'))")
          h3.title {{ 'lbl_title_taxes' | translate }}
          p(v-html="nl2br(translate('txt_help_taxes'))")
          h3.title {{ 'lbl_title_troops' | translate }}
          p(v-html="nl2br(translate('txt_help_troops'))")
        //
          h3.title {{ 'lbl_title_world' | translate }}
          p(v-html="nl2br(translate('txt_help_world'))")
          h3.title {{ 'lbl_title_places' | translate }}
          p(v-html="nl2br(translate('txt_help_units'))")
          h3.title {{ 'lbl_title_quests' | translate }}
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
