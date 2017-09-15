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

      mu-list.scroll
        mu-sub-header {{ 'lbl_title_resources' | translate }}
        mu-list-item(:title="translate('lbl_resource_turns')", disabled)
          mu-icon(slot="left", value=":ra ra-hourglass")
          mu-badge(slot="after") {{ user.turns | format }}
        mu-list-item(:title="translate('lbl_resource_gold')", disabled)
          mu-icon(slot="left", value=":ra ra-gold-bar")
          mu-badge(slot="after") {{ user.gold | format }}
        mu-list-item(:title="translate('lbl_resource_mana')", disabled)
          mu-icon(slot="left", value=":ra ra-droplet")
          mu-badge(slot="after") {{ user.mana | format }}
        mu-list-item(:title="translate('lbl_resource_people')", disabled)
          mu-icon(slot="left", value=":ra ra-double-team")
          mu-badge(slot="after") {{ user.people | format }}
        mu-list-item(:title="translate('lbl_resource_territory')", disabled)
          mu-icon(slot="left", value=":ra ra-tower")
          mu-badge(slot="after") {{ user.territory | format }}


        mu-sub-header {{ 'lbl_title_interior' | translate }}
        mu-list-item(:title="translate('lbl_title_kingdom')", to="kingdom", @click="toggle")
          mu-icon(slot="left", value=":ra ra-scroll-unfurled")
        mu-list-item(:title="translate('lbl_title_infrastructure')", to="infrastructure", @click="toggle")
          mu-icon(slot="left", value=":ra ra-castle-flag")
        mu-list-item(:title="translate('lbl_title_tavern')", to="tavern", @click="toggle")
          mu-icon(slot="left", value=":ra ra-beer")
        mu-list-item(:title="translate('lbl_title_religion')", to="religion", @click="toggle")
          mu-icon(slot="left", value=":ra ra-ankh")

        mu-sub-header {{ 'lbl_title_magic' | translate }}
        mu-list-item(:title="translate('lbl_title_research')", to="research", @click="toggle")
          mu-icon(slot="left", value=":ra ra-crystal-ball")
        mu-list-item(:title="translate('lbl_title_sorcery')", to="sorcery", @click="toggle")
          mu-icon(slot="left", value=":ra ra-fire-ring")

        mu-sub-header {{ 'lbl_title_diplomacy' | translate }}
        mu-list-item(:title="translate('lbl_title_census')", to="census", @click="toggle")
          mu-icon(slot="left", value=":ra ra-trophy")

        mu-sub-header {{ 'lbl_title_knowledge' | translate }}
        mu-list-item(:title="translate('lbl_title_factions')", to="factions", @click="toggle")
          mu-icon(slot="left", value=":ra ra-aries")
        mu-list-item(:title="translate('lbl_title_buildings')", to="buildings", @click="toggle")
          mu-icon(slot="left", value=":ra ra-capitol")
        mu-list-item(:title="translate('lbl_title_spells')", to="spells", @click="toggle")
          mu-icon(slot="left", value=":ra ra-crystal-wand")
        mu-list-item(:title="translate('lbl_title_units')", to="units", @click="toggle")
          mu-icon(slot="left", value=":ra ra-crossed-axes")
        mu-list-item(:title="translate('lbl_title_artifacts')", to="artifacts", @click="toggle")
          mu-icon(slot="left", value=":ra ra-potion")
        mu-list-item(:title="translate('lbl_title_heroes')", to="heroes", @click="toggle")
          mu-icon(slot="left", value=":ra ra-helmet")
        mu-list-item(:title="translate('lbl_title_gods')", to="gods", @click="toggle")
          mu-icon(slot="left", value=":ra ra-bleeding-eye")

    // transition(name="router", enter-active-class="animated fadeIn", mode="out-in")
    router-view.router.scroll
</template>

<script>
  import store from './vuex/store'
  import firebase from './services/firebase'

  export default {
    name: 'app',
    methods: {
      toggle () {
        store.commit('toggle')
      }
    },
    firebase: {
      user: {
        source: firebase.ref('users').child(store.state.username),
        asObject: true
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
  $radius = 5px
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
    .scroll::-webkit-scrollbar
      width 3px
    .scroll::-webkit-scrollbar-track
      background transparent
    .scroll::-webkit-scrollbar-thumb
      background $gold
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
      .mu-card-text + .mu-card-text
        padding-top 0
      .mu-card-text + .mu-card-actions
        padding-top 0
      .mu-card-text
        // border-top 1px solid
        color $gold
        text-align center
        p
          font-style italic
          font-size 0.9em
        /*
        .mu-text-field
        .mu-select-field
          width 50%
        */
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
        align-items center
        justify-content center
        .mu-raised-button
          flex 1 1 0
          color inherit
          border 1px solid
          font-weight bold
          width 100%
          text-transform none
        .mu-raised-button + .mu-raised-button
          margin-left 5px
    .mu-table
      border-radius $radius
      .mu-tfoot
        border-top 1px solid
        display flex
        justify-content center
        align-items center
        min-height 50px
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
        .mu-item
          min-height 36px
          height 36px
        .mu-item-left
          justify-content center
    @media (min-width 480px)
      .mu-appbar
        height 56px
    @media only screen and (min-width 1080px)
      #app
        .sidebar
          transform translateZ(0)
          visibility visible
          opacity $opacity
          .toggler
          .settings
            display none
        .router
          padding-left 256px
      .mu-overlay
        display none !important
</style>
