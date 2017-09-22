<template lang="pug">
  #app
    .background

    .toast
      mu-toast(v-if="toast.show", :message="translate(toast.message)", :class="toast.color", @close="untoast")

    mu-paper
      mu-appbar.topbar(:title="translate(title)", :class="right ? 'right' : 'left'")
        mu-icon-button.toggler(icon="menu", :slot="right ? 'right' : 'left'", @click="toggle")
        mu-icon-button.logout(icon="power_settings_new", :slot="!right ? 'right' : 'left'", @click="logout", :class="!logged ? 'hidden': ''")

    mu-drawer.sidebar(:open="menu", :docked="false", :right="right", :class="right ? 'right' : 'left'", @close="toggle")
      mu-paper
        mu-appbar {{ 'lbl_title_menu' | translate }}
          mu-icon-button.toggler(icon="menu", :slot="right ? 'right' : 'left'", @click="toggle")
          mu-icon-button.settings(icon="settings", :slot="!right ? 'right' : 'left'", to="settings", @click="toggle")

      mu-list.scroll
        template(v-if="logged")
          mu-sub-header {{ 'lbl_title_resources' | translate }}
          mu-list-item(:title="translate('lbl_resource_turns')", disabled)
            mu-icon(slot="left", value=":ra ra-hourglass")
            mu-badge(slot="after") {{ user.turns | numeric }}
          mu-list-item(:title="translate('lbl_resource_gold')", disabled)
            mu-icon(slot="left", value=":ra ra-gold-bar")
            mu-badge(slot="after") {{ user.gold | numeric }}
          mu-list-item(:title="translate('lbl_resource_mana')", disabled)
            mu-icon(slot="left", value=":ra ra-droplet-splash")
            mu-badge(slot="after") {{ user.mana | numeric }}
          mu-list-item(:title="translate('lbl_resource_people')", disabled)
            mu-icon(slot="left", value=":ra ra-double-team")
            mu-badge(slot="after") {{ user.people | numeric }}
          mu-list-item(:title="translate('lbl_resource_territory')", disabled)
            mu-icon(slot="left", value=":ra ra-tower")
            mu-badge(slot="after") {{ user.territory | numeric }}

          mu-sub-header {{ 'lbl_title_enchantments' | translate }}
          mu-list-item(v-for="enchantment, index in enchantments", :title="translate(enchantment.name)", :key="index", disabled)
            mu-icon(slot="left", value=":ra ra-bleeding-eye", :class="enchantment.color")
            mu-badge(slot="after") {{ enchantment.remaining | numeric }}

          mu-sub-header {{ 'lbl_title_economy' | translate }}
          mu-list-item(:title="translate('lbl_title_kingdom')", to="kingdom", @click="toggle")
            mu-icon(slot="left", value=":ra ra-queen-crown")
          mu-list-item(:title="translate('lbl_title_levy')", to="levy", @click="toggle")
            mu-icon(slot="left", value=":ra ra-scroll-unfurled")
          mu-list-item(:title="translate('lbl_title_explore')", to="explore", @click="toggle")
            mu-icon(slot="left", value=":ra ra-compass")
          mu-list-item(:title="translate('lbl_title_infrastructure')", to="infrastructure", @click="toggle")
            mu-icon(slot="left", value=":ra ra-castle-flag")

          mu-sub-header {{ 'lbl_title_military' | translate }}
          mu-list-item(:title="translate('lbl_title_troops')", to="troops", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crossed-axes")
          mu-list-item(:title="translate('lbl_title_battle')", to="battle", @click="toggle")
            mu-icon(slot="left", value=":ra ra-dripping-blade")
          mu-list-item(:title="translate('lbl_title_quests')", to="quests", @click="toggle")
            mu-icon(slot="left", value=":ra ra-torch")
          mu-list-item(:title="translate('lbl_title_defense')", to="defense", @click="toggle")
            mu-icon(slot="left", value=":ra ra-eye-shield")

          mu-sub-header {{ 'lbl_title_magic' | translate }}
          mu-list-item(:title="translate('lbl_title_meditate')", to="meditate", @click="toggle")
            mu-icon(slot="left", value=":ra ra-burst-blob")
          mu-list-item(:title="translate('lbl_title_research')", to="research", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystal-ball")
          mu-list-item(:title="translate('lbl_title_auction')", to="auction", @click="toggle")
            mu-icon(slot="left", value=":ra ra-quill-ink")
          mu-list-item(:title="translate('lbl_title_sorcery')", to="sorcery", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystal-wand")
          mu-list-item(:title="translate('lbl_title_dispel')", to="dispel", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystals")

          mu-sub-header {{ 'lbl_title_diplomacy' | translate }}
          mu-list-item(:title="translate('lbl_title_tavern')", to="tavern", @click="toggle")
            mu-icon(slot="left", value=":ra ra-beer")
          mu-list-item(:title="translate('lbl_title_religion')", to="religion", @click="toggle")
            mu-icon(slot="left", value=":ra ra-ankh")
          mu-list-item(:title="translate('lbl_title_messages')", to="messages", @click="toggle")
            mu-icon(slot="left", value=":ra ra-raven")
          mu-list-item(:title="translate('lbl_title_census')", to="census", @click="toggle")
            mu-icon(slot="left", value=":ra ra-trophy")

          mu-sub-header {{ 'lbl_title_account' | translate }}
          mu-list-item(:title="translate('lbl_title_settings')", to="settings", @click="toggle")
            mu-icon(slot="left", value=":ra ra-gears")
          mu-list-item(:title="translate('lbl_title_help')", to="help", @click="toggle")
            mu-icon(slot="left", value=":ra ra-help")

        mu-sub-header {{ 'lbl_title_knowledge' | translate }}
        mu-list-item(:title="translate('lbl_title_factions')", to="factions", @click="toggle")
          mu-icon(slot="left", value=":ra ra-doubled")
        mu-list-item(:title="translate('lbl_title_buildings')", to="buildings", @click="toggle")
          mu-icon(slot="left", value=":ra ra-capitol")
        mu-list-item(:title="translate('lbl_title_spells')", to="spells", @click="toggle")
          mu-icon(slot="left", value=":ra ra-fire-ring")
        mu-list-item(:title="translate('lbl_title_units')", to="units", @click="toggle")
          mu-icon(slot="left", value=":ra ra-batwings")
        mu-list-item(:title="translate('lbl_title_artifacts')", to="artifacts", @click="toggle")
          mu-icon(slot="left", value=":ra ra-round-bottom-flask")
        mu-list-item(:title="translate('lbl_title_places')", to="places", @click="toggle")
          mu-icon(slot="left", value=":ra ra-pyramids")
        mu-list-item(:title="translate('lbl_title_heroes')", to="heroes", @click="toggle")
          mu-icon(slot="left", value=":ra ra-helmet")
        mu-list-item(:title="translate('lbl_title_gods')", to="gods", @click="toggle")
          mu-icon(slot="left", value=":ra ra-lightning-storm")

    router-view.router.scroll(:class="right ? 'right' : 'left'")
</template>

<script>
  import store from './vuex/store'
  import { database, auth } from './services/firebase'

  export default {
    name: 'app',
    methods: {
      toggle () {
        store.commit('toggle')
      },
      untoast () {
        store.commit('untoast')
      },
      logout () {
        auth.signOut()
      }
    },
    created () {
      auth.onAuthStateChanged(user => {
        if (user) {
          store.commit('username', user.username)
          this.$router.push('/census')
        } else {
          store.commit('username', null)
          this.$router.push('/login')
        }
      })
      store.watch((state) => state.toast.show, (value) => {
        if (value) {
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => { this.untoast() }, store.state.toast.delay)
        } else {
          if (this.timer) clearTimeout(this.timer)
        }
      })
      this.$firebaseRefs.user.child('settings').once('value').then(snapshot => {
        store.commit('settings', snapshot.val())
      })
    },
    firebase: {
      user: {
        source: database.ref('users').child(store.state.username),
        asObject: true
      },
      enchantments: database.ref('users').child(store.state.username).child('enchantments')
    },
    computed: {
      menu () {
        return store.state.menu
      },
      title () {
        return store.state.title
      },
      right () {
        return store.state.settings.navbar
      },
      toast () {
        return store.state.toast
      },
      logged () {
        return store.state.logged
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
    .mu-chip
      border 1px solid
      line-height 22px
      margin 2px
      font-size 0.8em
    .hidden
      visibility hidden
    .mu-dialog
      background-color transparent
      box-shadow none
      .mu-dialog-body
        padding 0
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
      border 1px solid
      .mu-card-media
        display flex
        justify-content center
        align-items center
        img
          border-top-left-radius $radius
          border-top-right-radius $radius
          border-bottom 1px solid
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
          border 1px solid
          background-color $dark
      .mu-card-text + .mu-card-text
        padding-top 0
      .mu-card-text + .mu-card-actions
        padding-top 0
      .mu-card-text
        text-align center
        p
          font-style italic
          font-size 0.9em
        .stats
          display flex
          justify-content center
          align-items center
          flex-wrap wrap
          .mu-chip
            cursor initial
            width 40%
            border 1px solid
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
    .mu-toast
      border 1px solid
    .flex
      display flex
      flex-wrap wrap
    .mu-table
      border-radius $radius
      .mu-tr
        cursor pointer
      .mu-tfoot
        padding 5px
        border-top 1px solid
        display flex
        justify-content center
        align-items center
        min-height 50px
        .mu-raised-button
          flex 1 1 0
          color inherit
          border 1px solid
          font-weight bold
          width 100%
          text-transform none
        .mu-raised-button + .mu-raised-button
          margin-left 5px
    .mu-drawer
      height 100%
      overflow hidden
      &.right
        border-left 1px solid
      &.left
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
    /*
    .toast
      position absolute
      display flex
      justify-content center
      align-items center
      left 0
      right 0
      bottom 0
      margin 4px
      width 100%
      .mu-toast
        width auto
        max-width none
        position relative
        text-align center
    */
    // background colors
    .mu-toast
    .mu-chip
    .mu-card #title
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
    // font colors
    .mu-icon
      &.red
        color $red
      &.green
        color $green
      &.purple
        color $purple
      &.blue
        color $blue
      &.white
        color $white
      &.dark
        color $dark
    // border colors
    .bordered
      border 3px solid
      border-radius 50%
      &.red
        border-color $red
      &.green
        border-color $green
      &.purple
        border-color $purple
      &.blue
        border-color $blue
      &.white
        border-color $white
      &.dark
        border-color $dark
    @media (min-width 480px)
      .mu-appbar
        height 56px
    @media only screen and (min-width 1080px)
      #app
        .sidebar
          border none
          transform translateZ(0)
          visibility visible
          opacity $opacity
          .toggler
          .settings
            display none
          &.left
            .mu-list
              border-right 1px solid
          &.right
            .mu-list
              border-left 1px solid
        .topbar
        .router
          &.left
            padding-left 256px
          &.right
            padding-right 256px
        .topbar
          .toggler
          .logout
            display none
        /*
        .toast
          justify-content flex-end
          bottom initial
          top 0
          .mu-toast
            right 20px
        */
      .mu-overlay
        // display none !important
</style>
