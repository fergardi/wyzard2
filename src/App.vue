<template lang="pug">
  #app
    .background

    mu-paper
      mu-appbar.topbar(:title="translate(title)")
        mu-icon-button.toggler(icon="menu", slot="left", @click="toggle")
        mu-icon-button.help(icon="help", slot="right", to="help")

    mu-drawer.sidebar(:open="menu", :docked="false", @close="toggle")
      mu-paper
        mu-appbar {{ 'lbl_title_menu' | translate }}
          mu-icon-button.toggler(icon="menu", slot="left", @click="toggle")
          mu-icon-button.settings(icon="settings", slot="right", to="settings", @click="toggle")

      mu-list
        mu-sub-header {{ 'lbl_title_interior' | translate }}
        mu-list-item(:title="translate('lbl_title_infrastructure')", to="infrastructure", @click="toggle")
          mu-icon(slot="left", value="home")

        mu-sub-header {{ 'lbl_title_encyclopedia' | translate }}
        mu-list-item(:title="translate('lbl_title_factions')", to="factions", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_buildings')", to="buildings", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_spells')", to="spells", @click="toggle")
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_units')", to="units", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_artifacts')", to="artifacts", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_heroes')", to="heroes", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_title_gods')", to="gods", @click="toggle")          
          mu-icon(slot="left", value="home")

    // transition(name="router", enter-active-class="animated fadeIn", mode="out-in")
    router-view.router
</template>

<script>
  import store from './vuex/store'

  export default {
    name: 'app',
    methods: {
      toggle () {
        store.commit('toggle')
      }
    },
    computed: {
      menu () {
        return store.state.menu
      },
      title () {
        return store.state.title
      }
    }
  }
</script>

<style lang="stylus">
  $opacity = 0.95
  @import './css/colors.styl'
  html
  body
    padding 0
    margin 0
    height 100%
    width 100%
    box-sizing border-box
    user-select none !important
    .background
      width 100%
      height 100%
      position absolute
      filter grayscale(100%)
      background url("https://cdn.allwallpaper.in/wallpapers/1920x1200/2705/scrolls-v-skyrim-artwork-dragons-games-towns-1920x1200-wallpaper.jpg") no-repeat center center fixed
      background-size cover
      z-index -9999
    #app
      height 100%
      overflow hidden
    .topbar
      position fixed
    .router
      margin-top 56px
      height calc(100% - 56px)
      overflow-y auto
    .mu-appbar
      border-bottom 1px solid
    .mu-appbar-title
      display flex
      justify-content center
      align-items center
    .row
      justify-content flex-start
    .mu-card
      opacity $opacity
      $radius = 5px
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
          position relative
          float left
          width 250px
          height 250px
          background-position 50% 50%
          background-repeat no-repeat
          background-size cover
          object-fit cover
          object-position 50% 20%
        #title
          font-weight bold
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
          &.dark
            background-color $dark
      .mu-card-text
        // border-top 1px solid
        color $gold
        text-align center
        p
          font-style italic
          font-size 0.9em
        .mu-text-field
          width 50%
        .stats
          display flex
          justify-content center
          align-items center
          flex-wrap wrap
          .mu-chip
            cursor initial
            width 40%
            color $gold
            border 1px solid $gold
            background-color $dark
            line-height 22px
            margin 2px
            font-size 0.8em
            display flex
            justify-content space-between
            align-items center
            .ra
              line-height 23px
      .mu-card-actions
        // border-top 1px solid
        display flex
        justify-content space-between
      .mu-raised-button
        color inherit
        border 1px solid
        font-weight bold
        width 49%
        text-transform none
      .mu-raised-button + .mu-raised-button
        margin-left 5px
    .mu-drawer
      height 100%
      overflow hidden
      border-right 1px solid
      .mu-list
        overflow-y auto
        height calc(100% - 56px)
        .router-link-active
          background-color rgba(173, 131, 90, 0.1)
        .mu-sub-header
          line-height 36px
        .mu-item-left
          justify-content center
    @media (min-width 480px)
      .mu-appbar
        height 56px
    @media only screen and (max-width 1079px)
      #app
        .sidebar
          border-right 1px solid
    @media only screen and (min-width 1080px)
      #app
        .sidebar
          border-right none
          transform translateZ(0)
          visibility visible
          opacity $opacity
          .toggler
          .settings
            display none
          .mu-list
            border-right 1px solid
        .router
          padding-left 256px
      .mu-overlay
        display none !important
</style>
