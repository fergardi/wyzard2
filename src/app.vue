<template lang="pug">
  #app
    .background

    .toast
      mu-toast(v-if="toast.show", :message="translate(toast.message)", :class="toast.color", @close="untoast")

    mu-paper
      mu-appbar.topbar(:title="translate(title)", :class="right ? 'right' : 'left'")
        mu-icon-button.toggler(icon=":ra ra-three-keys", :slot="right ? 'right' : 'left'", @click="toggle")
        mu-icon-button.login(icon=":ra ra-locked-fortress", :slot="!right ? 'right' : 'left'", @click="logout", :class="!logged ? 'none': ''")
        mu-icon-button.logout(icon=":ra ra-key", :slot="!right ? 'right' : 'left'", to="login", :class="logged ? 'none': ''")

    mu-drawer.sidebar(:open="menu", :docked="overlay", :right="right", :class="right ? 'right' : 'left'", @close="toggle")
      mu-paper
        mu-appbar {{ 'lbl_title_menu' | translate }}
          mu-icon-button.toggler(icon=":ra ra-three-keys", :slot="right ? 'right' : 'left'", @click="toggle")
          mu-icon-button.settings(icon=":ra ra-gears", :slot="!right ? 'right' : 'left'", to="settings", @click="toggle")

      mu-list.scroll
        template(v-if="logged")
          mu-sub-header(v-if="enchantments.length") {{ 'lbl_title_enchantments' | translate }}
          mu-list-item(v-for="enchantment, index in enchantments", :title="translate(enchantment.name)", :key="index", disabled)
            // mu-avatar(icon=":ra ra-chain", :backgroundColor="enchantment.color", slot="leftAvatar")
            mu-icon(slot="left", value=":ra ra-chain", :class="enchantment.color")
            mu-badge(slot="after") {{ enchantment.remaining | numeric }}

          mu-sub-header(v-if="blessings.length") {{ 'lbl_title_blessings' | translate }}
          mu-list-item(v-for="blessing, index in blessings", :title="translate(blessing.name)", :key="index", disabled)
            // mu-avatar(icon=":ra ra-bleeding-eye", :backgroundColor="blessing.color", slot="leftAvatar")
            mu-icon(slot="left", value=":ra ra-bleeding-eye", :class="blessing.color")

          mu-sub-header {{ 'lbl_title_resources' | translate }}
          mu-list-item(:title="translate('lbl_resource_turns')", disabled)
            mu-icon(slot="left", value=":ra ra-hourglass")
            mu-badge(slot="after")
              span.income(:class="income ? 'green' : 'red'") {{ income ? '&#9650;' : '&#9660;' }}
              span {{ user.turns | numeric }}
          mu-list-item(:title="translate('lbl_resource_gold')", disabled)
            mu-icon(slot="left", value=":ra ra-gold-bar")
            mu-badge(slot="after")
              span.income(:class="income ? 'green' : 'red'") {{ income ? '&#9650;' : '&#9660;' }}
              span {{ user.gold | numeric }}
          mu-list-item(:title="translate('lbl_resource_mana')", disabled)
            mu-icon(slot="left", value=":ra ra-droplet-splash")
            mu-badge(slot="after")
              span.income(:class="income ? 'green' : 'red'") {{ income ? '&#9650;' : '&#9660;' }}
              span {{ user.mana | numeric }}
          mu-list-item(:title="translate('lbl_resource_people')", disabled)
            mu-icon(slot="left", value=":ra ra-double-team")
            mu-badge(slot="after")
              span.income(:class="income ? 'green' : 'red'") {{ income ? '&#9650;' : '&#9660;' }}
              span {{ user.people | numeric }}
          mu-list-item(:title="translate('lbl_resource_territory')", disabled)
            mu-icon(slot="left", value=":ra ra-tower")
            mu-badge(slot="after")
              span.income(:class="income ? 'green' : 'red'") {{ income ? '&#9650;' : '&#9660;' }}
              span {{ user.territory | numeric }}

          mu-sub-header {{ 'lbl_title_economy' | translate }}
          mu-list-item(:title="translate('lbl_title_kingdom')", to="kingdom", @click="toggle")
            mu-icon(slot="left", value=":ra ra-queen-crown")
          mu-list-item(:title="translate('lbl_title_levy')", to="levy", @click="toggle")
            mu-icon(slot="left", value=":ra ra-scroll-unfurled")
          mu-list-item(:title="translate('lbl_title_explore')", to="explore", @click="toggle")
            mu-icon(slot="left", value=":ra ra-compass")
          mu-list-item(:title="translate('lbl_title_infrastructure')", to="infrastructure", @click="toggle")
            mu-icon(slot="left", value=":ra ra-castle-flag")

          mu-sub-header {{ 'lbl_title_magic' | translate }}
          mu-list-item(:title="translate('lbl_title_meditate')", to="meditate", @click="toggle")
            mu-icon(slot="left", value=":ra ra-burst-blob")
          mu-list-item(:title="translate('lbl_title_research')", to="research", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystal-ball")
          mu-list-item(:title="translate('lbl_title_sorcery')", to="sorcery", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystal-wand")
          mu-list-item(:title="translate('lbl_title_dispel')", to="dispel", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystals")
          mu-list-item(:title="translate('lbl_title_relics')", to="relics", @click="toggle")
            mu-icon(slot="left", value=":ra ra-vase")

          mu-sub-header {{ 'lbl_title_diplomacy' | translate }}
          mu-list-item(:title="translate('lbl_title_auction')", to="auction", @click="toggle")
            mu-icon(slot="left", value=":ra ra-quill-ink")
          mu-list-item(:title="translate('lbl_title_tavern')", to="tavern", @click="toggle")
            mu-icon(slot="left", value=":ra ra-beer")
          mu-list-item(:title="translate('lbl_title_devotion')", to="devotion", @click="toggle")
            mu-icon(slot="left", value=":ra ra-ankh")
          mu-list-item(:title="translate('lbl_title_messages')", to="messages", @click="toggle")
            mu-icon(slot="left", value=":ra ra-raven")
          mu-list-item(:title="translate('lbl_title_census')", to="census", @click="toggle")
            mu-icon(slot="left", value=":ra ra-trophy")

          mu-sub-header {{ 'lbl_title_military' | translate }}
          mu-list-item(:title="translate('lbl_title_troops')", to="troops", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crossed-axes")
          mu-list-item(:title="translate('lbl_title_battle')", to="battle", @click="toggle")
            mu-icon(slot="left", value=":ra ra-dripping-blade")
          mu-list-item(:title="translate('lbl_title_quests')", to="quests", @click="toggle")
            mu-icon(slot="left", value=":ra ra-torch")
          mu-list-item(:title="translate('lbl_title_defense')", to="defense", @click="toggle")
            mu-icon(slot="left", value=":ra ra-eye-shield")

        mu-sub-header {{ 'lbl_title_account' | translate }}
        mu-list-item(:title="translate('lbl_title_settings')", to="settings", @click="toggle")
          mu-icon(slot="left", value=":ra ra-gears")

        mu-sub-header {{ 'lbl_title_knowledge' | translate }}
        mu-list-item(:title="translate('lbl_title_help')", to="help", @click="toggle")
          mu-icon(slot="left", value=":ra ra-help")
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
          mu-icon(slot="le7ft", value=":ra ra-pyramids")
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
        store.commit('uid', null)
        this.$router.push('/login')
      }
    },
    created () {
      // toast
      store.watch((state) => state.toasts, (toasts) => {
        if (toasts.length > 0) {
          Object.assign(store.state.toast, toasts[0])
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => { this.untoast() }, store.state.toast.delay)
        } else {
          if (this.timer) clearTimeout(this.timer)
        }
      })
      // firebase
      store.watch((state) => state.logged, (value) => {
        if (value) {
          store.dispatch('user', database.ref('users').child(store.state.uid))
          this.$bindAsArray('enchantments', database.ref('users').child(store.state.uid).child('enchantments'))
          this.$bindAsArray('blessings', database.ref('gods').orderByChild('uid').equalTo(store.state.uid))
          database.ref('users').child(store.state.uid).child('messages').on('child_added', message => {
            store.commit('info', this.translate(message.val().subject))
          })
        }
      })
      // messaging
      /*
      messaging.requestPermission()
      .then(() => {
        store.commit('info', 'lbl_toast_notifications_ok')
      })
      .catch(() => {
        store.commit('info', 'lbl_toast_notifications_error')
      })
      */
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
      },
      overlay () {
        return window.innerWidth > 1024
      },
      user () {
        return store.state.user
      },
      income () {
        return Math.random() >= 0.5
      }
    }
  }
</script>

<style src="../node_modules/animate.css/animate.min.css"></style>

<style lang="stylus">
  $opacity = 0.975
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
    .none
      display none
    .mu-table
      margin-bottom 5px
    .mu-dialog
      width 95%
      min-width 95%
      max-height 95%
      background-color transparent
      box-shadow none
      .mu-dialog-body
        padding 0
        color inherit
        .conquest
          .army
            .troop
              margin-top 10px
              display flex
              justify-content space-between
              align-items center
              .name
              .quantity
                padding 5px 10px
                font-weight bold
                border-radius 5px
                font-size 0.8em
                border 1px solid
                display inline-block
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
      .mu-card-header
        text-align center
        font-weight bold
        .mu-card-header-title
          padding-right 0
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
          width 200px
          height 200px
          background-position 50% 50%
          background-repeat no-repeat
          background-size cover
          object-fit cover
          object-position 50% 20%
        .card-info
          position absolute
          bottom -16px
          width 100%
          text-align center
          .card-title
          .card-number
            padding 5px 10px
            font-weight bold
            border-radius 5px
            text-align center
            border 1px solid
            background-color $dark
            width auto
            display inline-block
          .card-title
            min-width 50%
            max-width 60%
          .card-number
            min-width 5%
            max-width 30%
          .card-title + .card-number
          .card-number + .card-number
            margin-left 1%
      .mu-card-text + .mu-card-text
      .mu-card-text + .mu-card-actions
      .mu-card-text + form .mu-card-text
      .mu-card-text + form .mu-card-actions
        padding-top 0
      .mu-card-text
        text-align center
        .mu-select-field
          text-align left
        .mu-text-field.disabled
          color $gold
        p
          font-style italic
          font-size 0.9em
        .card-stats
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
          &.hover .mu-raised-button-wrapper
            background-color darken($dark, 20%) !important
          &.disabled
            color $dark !important
            background-color $gold !important
        .mu-raised-button + .mu-raised-button
          margin-left 5px
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
          .income
            margin-right 5px
        .mu-item-left
          justify-content center
    // background colors
    .mu-toast
    .mu-chip
    .mu-card .card-info .card-title, .mu-card .card-info .card-number
    .mu-dialog .conquest .army .troop .name, .mu-dialog .conquest .army .troop .quantity
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
    .income
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
    .mu-raised-button
      border-radius $radius
    .mu-toast
      text-align center
      height 48px
      line-height 48px
      padding 0 24px
      width 98%
      max-width 98%
      position fixed
      left 1%
      bottom 1%
      font-weight bold
      border 1px solid
      border-radius $radius
    @media only screen and (min-width 480px) and (max-width 1079px)
      .mu-toast
        width 250px
        min-width 250px
        right 2% !important
        top 10% !important
        left auto !important
        bottom auto !important
      .mu-dialog
        width 75%
        min-width 75%
        max-width 75%
    @media only screen and (min-width 480px)
      .mu-appbar
        height 56px
    @media only screen and (min-width 1080px)
      .mu-toast
        width 250px
        min-width 250px
        top 10% !important
        right 2% !important
        left auto !important
        bottom auto !important
      .sidebar
        border none
        transform translateZ(0)
        visibility visible
        opacity $opacity
        .toggler
        .settings
          visibility hidden
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
          visibility hidden
      .mu-dialog
        width 50%
        min-width 50%
        max-width 50%
</style>
