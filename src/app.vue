<template lang="pug">
  #app
    .background(:style="{ 'background-image': 'url(' + picture('miscellaneous', 'background') + ')' }")

    .toast
      mu-toast(v-if="toast.show", :message="toast.icon + ' ' + translate(toast.message)", :class="[toast.color, settings.navbar ? 'left' : 'right']", @close="untoast")

    mu-paper(:zDepth="6")
      mu-appbar.topbar(:title="translate(title)", :class="settings.navbar ? 'right' : 'left'")
        mu-icon-button.toggler(icon=":ra ra-three-keys", :slot="settings.navbar ? 'right' : 'left'", @click="toggle")
        mu-icon-button.tutorial(icon=":ra ra-help", :slot="!settings.navbar ? 'right' : 'left'", @click="sos")

    mu-drawer.sidebar(:open="menu", :docked="overlay", :right="settings.navbar", :class="settings.navbar ? 'right' : 'left'", @close="toggle")
      mu-paper(:zDepth="6")
        mu-appbar(v-if="!settings.navbar")
          mu-icon-button.toggler(icon=":ra ra-three-keys", @click="toggle")
          mu-icon-button.help(icon=":ra ra-scroll-unfurled", to="help", @click="toggle")
          mu-icon-button.settings(icon=":ra ra-gears", to="settings", @click="toggle")
        mu-appbar(v-else)
          mu-icon-button.settings(icon=":ra ra-gears", to="settings", @click="toggle")
          mu-icon-button.help(icon=":ra ra-scroll-unfurled", to="help", @click="toggle")
          mu-icon-button.toggler(icon=":ra ra-three-keys", @click="toggle")

      mu-list.scroll
        template(v-if="logged")

          mu-sub-header {{ 'lbl_title_resources' | translate }}
          mu-list-item(:title="translate('lbl_resource_gold')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.goldPerTurn >= 0 ? 'green' : 'red'")
              mu-icon(value=":ra ra-gold-bar")
              span(slot="content") {{ user.goldPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.gold | minimize }}
          mu-list-item(:title="translate('lbl_resource_people')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.peoplePerTurn >= 0 ? 'green' : 'red'")
              mu-icon(value=":ra ra-double-team")
              span(slot="content") {{ user.peoplePerTurn >= 0 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.people | minimize }} / {{ user.peopleCap | minimize }}
          mu-list-item(:title="translate('lbl_resource_mana')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.manaPerTurn >= 0 ? 'green' : 'red'")
              mu-icon(value=":ra ra-burst-blob")
              span(slot="content") {{ user.manaPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.mana | minimize }} / {{ user.manaCap | minimize }}
          mu-list-item(:title="translate('lbl_resource_terrain')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.terrainPerTurn >= 0 ? 'green' : 'red'")
              mu-icon(value=":ra ra-tower")
              span(slot="content") {{ user.terrainPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.terrain | minimize }} / {{ user.domains | minimize }}
          mu-list-item(:title="translate('lbl_resource_magic')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.magic < 10 ? 'green' : 'red'")
              mu-icon(value=":ra ra-crystal-wand")
              span(slot="content") {{ user.magic < 10 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.magic | numeric }} / {{ 10 | numeric }}
          mu-list-item(:title="translate('lbl_resource_turns')", disabled)
            mu-badge(slot="left", circle, :badgeClass="user.turns < 300 ? 'green' : 'red'")
              mu-icon(value=':ra ra-hourglass')
              span(slot="content") {{ user.turns < 300 ? '&#9650;' : '&#9660;' }}
            mu-badge(slot="after") {{ user.turns | numeric }} / {{ 300 | numeric }}

          mu-sub-header {{ 'lbl_title_bonuses' | translate }}
          mu-list-item(:title="translate('lbl_title_infrastructure')", disabled)
            mu-icon(slot="left", value=":ra ra-anvil")
            mu-badge(slot="after") {{ user.constructionBonus | percentage }}
          mu-list-item(:title="translate('lbl_title_research')", disabled)
            mu-icon(slot="left", value=":ra ra-anvil")
            mu-badge(slot="after") {{ user.researchBonus | percentage }}

          template(v-if="blessings && blessings.length")
            mu-sub-header {{ 'lbl_title_blessings' | translate }}
            mu-list-item(v-for="blessing, index in blessings", :title="translate(blessing.name)", :key="index", disabled)
              mu-icon(slot="left", value=":ra ra-bleeding-eye", :class="blessing.color")

          template(v-if="enchantments && enchantments.length")
            mu-sub-header {{ 'lbl_title_enchantments' | translate }}
            mu-list-item(v-for="enchantment, index in enchantments", :title="translate(enchantment.name)", :key="index", disabled)
              mu-icon(slot="left", value=":ra ra-mirror", :class="enchantment.color")
              mu-badge(slot="after") {{ enchantment.remaining | minimize }}

          mu-sub-header(v-if="user.contracts") {{ 'lbl_title_contracts' | translate }}
          mu-list-item(v-for="contract, index in user.contracts", :title="translate(contract.name)", :key="index", disabled)
            mu-icon(slot="left", value=":ra ra-hood", :class="contract.color")
            mu-badge(slot="after") {{ contract.level | minimize }}

          mu-sub-header(v-if="user.troops") {{ 'lbl_title_troops' | translate }}
          mu-list-item(v-for="troop, index in user.troops", :title="translate(troop.name)", :key="index", disabled)
            mu-icon(slot="left", value=":ra ra-crossed-axes", :class="troop.color")
            mu-badge(slot="after") {{ troop.quantity | minimize }}

          mu-sub-header {{ 'lbl_title_economy' | translate }}
          mu-list-item(:title="translate('lbl_title_kingdom')", to="kingdom", @click="toggle")
            mu-icon(slot="left", value=":ra ra-queen-crown")
          mu-list-item(:title="translate('lbl_title_infrastructure')", to="infrastructure", @click="toggle")
            mu-icon(slot="left", value=":ra ra-castle-flag")
          mu-list-item(:title="translate('lbl_title_exploration')", to="exploration", @click="toggle")
            mu-icon(slot="left", value=":ra ra-compass")
          mu-list-item(:title="translate('lbl_title_taxes')", to="taxes", @click="toggle")
            mu-icon(slot="left", value=":ra ra-mining-diamonds")
          //mu-list-item(:title="translate('lbl_title_world')", to="world", @click="toggle")
            mu-icon.red(slot="left", value=":ra ra-wooden-sign")

          mu-sub-header {{ 'lbl_title_magic' | translate }}
          mu-list-item(:title="translate('lbl_title_research')", to="research", @click="toggle")
            mu-icon(slot="left", value=":ra ra-acid")
          mu-list-item(:title="translate('lbl_title_sorcery')", to="sorcery", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystal-ball")
          mu-list-item(:title="translate('lbl_title_relics')", to="relics", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crystals")
          mu-list-item(:title="translate('lbl_title_meditate')", to="meditate", @click="toggle")
            mu-icon(slot="left", value=":ra  ra-sun")
          mu-list-item(:title="translate('lbl_title_dispel')", to="dispel", @click="toggle")
            mu-icon(slot="left", value=":ra ra-mirror")

          mu-sub-header {{ 'lbl_title_military' | translate }}
          mu-list-item(:title="translate('lbl_title_battle')", to="battle", @click="toggle")
            mu-icon(slot="left", value=":ra ra-dripping-blade")
          mu-list-item(:title="translate('lbl_title_troops')", to="troops", @click="toggle")
            mu-icon(slot="left", value=":ra ra-crossed-axes")
          mu-list-item(:title="translate('lbl_title_contracts')", to="contracts", @click="toggle")
            mu-icon(slot="left", value=":ra ra-hood")
          mu-list-item(:title="translate('lbl_title_defense')", to="defense", @click="toggle")
            mu-icon(slot="left", value=":ra ra-eye-shield")
          //mu-list-item(:title="translate('lbl_title_quests')", to="quests", @click="toggle")
            mu-icon(slot="left", value=":ra ra-torch")

          mu-sub-header {{ 'lbl_title_diplomacy' | translate }}
          mu-list-item(:title="translate('lbl_title_devotion')", to="devotion", @click="toggle")
            mu-icon(slot="left", value=":ra ra-ankh")
          mu-list-item(:title="translate('lbl_title_auction')", to="auction", @click="toggle")
            mu-icon(slot="left", value=":ra ra-large-hammer")
          mu-list-item(:title="translate('lbl_title_tavern')", to="tavern", @click="toggle")
            mu-icon(slot="left", value=":ra ra-beer")
          mu-list-item(:title="translate('lbl_title_messages')", to="messages", @click="toggle")
            mu-icon(slot="left", value=":ra ra-quill-ink")
          mu-list-item(:title="translate('lbl_title_census')", to="census", @click="toggle")
            mu-icon(slot="left", value=":ra ra-trophy")
        
        mu-sub-header {{ 'lbl_title_account' | translate }}
        mu-list-item(:title="translate('lbl_title_settings')", to="settings", @click="toggle")
          mu-icon(slot="left", value=":ra ra-gears")
        mu-list-item(:title="translate('lbl_title_login')", to="login", @click="toggle", v-if="!logged")
          mu-icon(slot="left", value=":ra ra-key")
        mu-list-item(:title="translate('lbl_title_logout')", @click="logout", v-else)
          mu-icon(slot="left", value=":ra ra-locked-fortress")

        mu-sub-header {{ 'lbl_title_knowledge' | translate }}
        mu-list-item(:title="translate('lbl_title_help')", to="help", @click="toggle")
          mu-icon(slot="left", value=":ra ra-scroll-unfurled")
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
        //mu-list-item(:title="translate('lbl_title_places')", to="places", @click="toggle")
          mu-icon(slot="left", value=":ra ra-pyramids")
        mu-list-item(:title="translate('lbl_title_heroes')", to="heroes", @click="toggle")
          mu-icon(slot="left", value=":ra ra-helmet")
        mu-list-item(:title="translate('lbl_title_gods')", to="gods", @click="toggle")
          mu-icon(slot="left", value=":ra ra-lightning-storm")

    router-view.router.scroll(:class="settings.navbar ? 'right' : 'left'")

    mu-popup(position="bottom", :open="popup", @close="sos")
      mu-appbar.popup(:title="translate(title)")
      mu-content-block.scroll
        p(v-html="nl2br(translate(help))")
</template>

<script>
  import store from '@/vuex/store'
  import { database, auth } from '@/services/firebase'
  import { updateGeneralStatus } from '@/services/api' // eslint-disable-line

  export default {
    name: 'app',
    data () {
      return {
        enchantments: [],
        blessings: []
      }
    },
    async created () {
      store.commit('title', 'lbl_title_wyzard')
      store.commit('help', 'txt_help_login')
      // toast
      store.watch((state) => state.toasts, (toasts) => {
        if (toasts.length > 0) {
          store.commit('queue')
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => { this.untoast() }, store.state.toast.delay)
        } else {
          if (this.timer) clearTimeout(this.timer)
        }
      })
      // initial
      store.watch((state) => state.uid, async (uid) => {
        if (uid) {
          await this.prepare(uid)
        }
      })
      if (store.state.uid) {
        await this.prepare(store.state.uid)
      }
    },
    methods: {
      async prepare (uid) {
        store.dispatch('user', database.ref('users').child(uid))
        await this.$bindAsArray('enchantments', database.ref('enchantments').orderByChild('target').equalTo(uid))
        await this.$bindAsArray('blessings', database.ref('gods').orderByChild('blessed').equalTo(uid))
        await updateGeneralStatus(uid)
        await database.ref('users').child(uid).child('messages').orderByChild('read').equalTo(false).on('child_added', message => {
          if (message) {
            store.commit('info', this.translate(message.val().subject))
            message.ref.update({ read: true })
          }
        })
        this.$router.push({ path: '/messages' })
      },
      toggle () {
        store.commit('toggle')
      },
      untoast () {
        store.commit('untoast')
      },
      sos () {
        store.commit('sos')
      },
      logout () {
        this.toggle()
        auth.signOut()
        store.commit('uid', null)
        this.$router.push('/login')
      }
    },
    computed: {
      menu () {
        return store.state.menu
      },
      title () {
        return store.state.title
      },
      popup () {
        return store.state.popup
      },
      help () {
        return store.state.help
      },
      toast () {
        return store.state.toast
      },
      logged () {
        return store.state.logged && store.state.uid && store.state.user
      },
      overlay () {
        return window.innerWidth > 1024
      },
      user () {
        return store.state.user || {}
      },
      settings () {
        return store.state.user != null && store.state.user.settings != null ? store.state.user.settings : store.state.settings
      }
    }
  }
</script>

<style lang="stylus">
  $opacity = 0.95
  $radius = 5px
  $duration = 0.3s

  @import './assets/css/colors.styl'
  html
  body
    padding 0
    margin 0
    height 100%
    width 100%
    box-sizing border-box
    user-select none !important
  body
    .background
      width 100%
      height 100%
      position absolute
      filter grayscale(100%)
      background-position center center
      background-repeat no-repeat
      background-attachment fixed
      background-size cover
      z-index -9999
    #app
      height 100%
      overflow hidden
    .hidden
      visibility hidden
    .none
      display none
    .mu-dialog
      font-size inherit !important
      width 95%
      min-width 95%
      max-height 95%
      background-color transparent
      box-shadow none
      .mu-dialog-body
        padding 0
        color inherit
    .mu-circular-progress
      position absolute
      width 100% !important
      height 100% !important
      display flex
      border-radius $radius
      background-color rgba(0,0,0,0.5)
      justify-content center
      align-items center
    .progress
      color $gold
      display flex
      justify-content center
      align-items center
      flex-direction column
      width 100%
      height 100%
      position absolute
      i
        animation e 1568ms linear infinite // to reuse muse.ui mu-circular-progress one
        margin-bottom 5px
    .topbar
      position fixed
    .scroll::-webkit-scrollbar
    .mu-menu-list::-webkit-scrollbar
      width 3px
    .scroll::-webkit-scrollbar-track
    .mu-menu-list::-webkit-scrollbar-track
      background transparent
    .scroll::-webkit-scrollbar-thumb
    .mu-menu-list::-webkit-scrollbar-thumb
      background $gold
    .router
      margin-top 56px
      height calc(100% - 56px)
      overflow-y auto
    .mu-appbar
      border-bottom 1px solid
      height 56px !important
    .topbar
    .popup
      .mu-appbar-title
        display flex
        justify-content center
        align-items center
    .sidebar
      .mu-appbar-title
        display flex
        justify-content space-between
        align-items center
    .row
      justify-content center
    .mu-chip
      cursor default
      width auto
      border 1px solid
      border-radius $radius
      background-color $dark
      line-height 22px
      margin 2px
      &:hover
        cursor initial
        background-color initial
      .ra
        line-height 23px
    .mu-card
      opacity $opacity
      margin 5px
      border-radius $radius
      border 1px solid
      .mu-card-header
        text-align center
        .mu-card-header-title
          padding-right 0
      .card-description
        min-height 5vh
      .mu-card-media
        width 100%
        height 250px
        .card-spinner
          position absolute
          top 0
          left 0
          bottom 0
          right 0
        .card-image
          display flex
          justify-content center
          align-items center
          overflow hidden
          transition transform $duration ease-in-out
          border-bottom 1px solid
          img
            border-top-left-radius $radius
            border-top-right-radius $radius
            position relative
            float left
            width 100%
            height 250px
            background-position 50% 50%
            background-repeat no-repeat
            background-size cover
            object-fit cover
            object-position 50% 20%
            transition transform 0.3s ease-in-out
          &:hover
            img
              transform scale(1.1)
        .card-extra
        .card-info
          cursor default
          position absolute
          width 100%
          text-align center
          z-index 5000
          .card-text
          .card-number
            position relative
            border-radius $radius
            text-align center
            border 1px solid
            background-color $dark
            width auto
            display inline-block
            padding 5px 10px
            i + span
              margin-left 3px
            span + i
              margin-right 3px
            &:before
              content ""
              position absolute
              top 0
              bottom 0
              left 0
              right 0
              z-index -1
              box-shadow 0 0 30px black
          .card-text + .card-number
          .card-number + .card-number
            margin-left 5px
          .card-text
            min-width 5%
            width auto
          .card-number
            min-width 5%
            with auto
        .card-extra
          bottom 23px
          .card-text
            max-width 60%
          .card-number
            max-width 60%
        .card-info
          bottom -16px
          .card-text
            max-width 75%
          .card-number
            max-width 20%
      &.forbidden:before
        position absolute
        cursor not-allowed
        pointer-events none
        width 100%
        height 100%
        background-color rgba(0,0,0,0.50)
        z-index 9999999
        content ""
        border-radius $border
      //.mu-card-media + .mu-card-text
        //margin-top 10px
      .mu-card-text + .mu-card-text
      .mu-card-text + form .mu-card-text
      //.mu-card-text + .mu-card-actions
        padding-top 0
      .mu-card-text
        font-style italic
        font-size 0.9em
        text-align center
        .mu-select-field
        .mu-text-field
          text-align left
        .mu-text-field.disabled
          color inherit
          .mu-text-field-content
            color inherit
        .card-stats
          display flex
          justify-content center
          align-items center
          flex-wrap wrap
          .mu-chip
            flex-grow 1
            width 100%
            cursor initial
            border 1px solid
            background-color $dark
            margin-left 1%
            margin-right 1%
            display flex
            justify-content space-between
            align-items center
            &.double
              width 45%
            &.triple
              width 30%
            &.one-quarter
              width 30%
            &.three-quarters
              width 60%
      .mu-card-actions
        display flex
        align-items center
        justify-content center
        border-top 1px solid
        .mu-raised-button
          flex 1 1 0
          color inherit
          border 1px solid
          width 100%
          text-transform none
          &.hover .mu-raised-button-wrapper
            background-color darken($dark, 20%) !important
        .mu-raised-button + .mu-raised-button
          margin-left 5px
    .mu-raised-button.disabled
    .mu-text-field-input.disabled
      opacity 0.5
      background-color inherit
    .flex
      display flex
      flex-wrap wrap
      width 100%
      justify-content center
    .mu-table
      margin-top 5px
      border-radius $radius
      .mu-tr
        cursor pointer
        transition transform $duration ease-in-out
        &:hover
          .mu-chip
            transform scale(1.1)
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
          width 100%
          text-transform none
        .mu-raised-button + .mu-raised-button
          margin-left 5px
    .mu-drawer
      min-width 256px
      width 22.5%
      height 100%
      overflow hidden
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
    .income
      margin-right 5px
    .mu-popover
      overflow-x auto
    // background colors
    .mu-toast
    .mu-chip
    .mu-card .card-text
    .mu-card .card-number
    .mu-badge
      background-color $dark !important
      &.red
        background-color $red !important
      &.green
        background-color $green !important
      &.purple
        background-color $purple !important
      &.blue
        background-color $blue !important
      &.white
        background-color $white !important
      &.dark
        background-color $dark !important
    // font colors
    .mu-icon
    .income
      &.red
        color $red !important
      &.green
        color $green !important
      &.purple
        color $purple !important
      &.blue
        color $blue !important
      &.white
        color $white !important
      &.dark
        color $dark !important
    // border colors
    .bordered
      border 3px solid
      border-radius 50%
      &.red
        border-color $red !important
      &.green
        border-color $green !important
      &.purple
        border-color $purple !important
      &.blue
        border-color $blue !important
      &.white
        border-color $white !important
      &.dark
        border-color $dark !important
    .mu-raised-button
      border-radius $radius
    .mu-pagination-item
      margin 0 3px
      &.active
        border 1px solid
        border-radius 5px
    .mu-infinite-scroll
      background-color $dark
      color $gold
      text-align center
      width 100%
      max-width 100%
      border 1px solid
      border-radius $radius
      padding 5px
      .mu-circle-spinner
        border-color $gold
    .mu-toast
      text-align center
      height 48px
      line-height 48px
      padding 0 24px
      width 100%
      max-width 100%
      position fixed
      border 1px solid
      border-radius $radius
      left 0 !important
      bottom 0 !important
    .ellipsis
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
    .mu-td
    .mu-th
      text-align center
    .mu-popup
      max-height 50vh
      .scroll
        max-height calc(50vh - 56px)
        overflow-y auto
        p
          font-size 0.9em
          font-style italic
          text-align center
          margin 1em
    .lazy
      width 100%
      transition opacity .5s ease-in
      opacity .5
    .lazy.lazy-load-progress
      filter blur(1px)
    .lazy.lazy-load-success
      opacity 1
    .lazy.lazy-load-error
      filter blur(1px) sepia(1)
      outline 4px solid red
    .tooltip
      z-index 99999999 !important
      display block !important
      z-index 10000
      .tooltip-inner
        background black
        color white
        border-radius $radius
        padding 5px 10px
        font-size 0.8em
      .tooltip-arrow
        width 0
        height 0
        border-style solid
        position absolute
        margin 5px
        border-color black
    .tooltip[x-placement^="top"]
      margin-bottom 5px
    .tooltip[x-placement^="top"] .tooltip-arrow
      border-width 5px 5px 0 5px
      border-left-color transparent !important
      border-right-color transparent !important
      border-bottom-color transparent !important
      bottom -5px
      left calc(50% - 5px)
      margin-top 0
      margin-bottom 0
    .tooltip[aria-hidden='true']
      visibility hidden
      opacity 0
      transition opacity .15s, visibility .15s
    .tooltip[aria-hidden='false']
      visibility visible
      opacity 1
      transition opacity .15s
    @media only screen and (min-width 480px)
      .mu-toast
        width 250px
        min-width 250px
        top 10% !important
        bottom auto !important
        &.left
          left 1% !important
          right auto !important
        &.right
          right 1% !important
          left auto !important
    @media only screen and (max-width 1079px)
      .mu-drawer
        width 90%
        &.left
          border-right 1px solid
        &.right
          border-left 1px solid
      .mu-popup
        width 100%
      .mu-dialog
        width 90%
        min-width 90%
        max-width 90%
    @media only screen and (min-width 1080px)
      .sidebar
        border none
        transform translateZ(0) !important
        visibility visible
        opacity $opacity
        &.left
          .mu-list
            border-right 1px solid
        &.right
          .mu-list
            border-left 1px solid
        .toggler
          display none
      .topbar
        .toggler
          visibility hidden
      .topbar
      .router
        &.left
          padding-left 22.5%
        &.right
          padding-right 22.5%
      .mu-popup
      .mu-dialog
        width 35%
        min-width 35%
        max-width 35%
</style>
