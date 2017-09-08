<template lang="pug">
  mu-paper
    mu-card.spell
      mu-card-media
        img(:src="data.image")
        #title(:class="data.faction.color") {{ data.name | translate }}
      mu-card-text
        p {{ data.description | lorem }}
        .stats
          mu-chip
            span {{ 'lbl_stat_level' | translate }} 10
          mu-chip
            span {{ 3214325 | format }} {{ 'lbl_stat_mana' | translate }}
          mu-chip
            span {{ data.category | translate }}
</template>

<script>
  import store from '../vuex/store'
  import i18n from '../services/i18n'

  export default {
    name: 'spell',
    props: ['data'],
    methods: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../css/colors.styl'
  $radius = 5px
  .spell
    margin 5px
    border-radius $radius
    border 1px solid $gold
    .mu-card-media
      display flex
      justify-content center
      align-items center
      img
        border-top-left-radius $radius
        border-top-right-radius $radius
        border-bottom 1px solid $gold
      #title
        position absolute
        bottom -15px
        padding 5px
        border-radius 5px
        min-width 50%
        max-width 90%
        text-align center
        border 1px solid $gold
        color $gold
        background-color $dark
        &.red
          background-color $red
        &.green
          background-color $green
        &.purple
          background-color $purple
        &.blue
          background-color $blue
        &.white
          background-color $white
    .mu-card-text
      color $gold
      .stats
        display flex
        justify-content center
        align-items center
        .mu-chip
          width 50%
          color $gold
          border 1px solid $gold
          background-color $dark
          line-height 20px
          margin 2px
          font-size 0.8em
          display flex
          justify-content center
          align-items center
</style>
