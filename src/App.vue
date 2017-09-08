<template lang="pug">
  #app

    mu-paper
      mu-appbar.topbar(:title="translate(title)", :zDepth="0")
        mu-icon-button(icon="menu", slot="left", @click="toggle")
        mu-icon-button(icon="help", slot="right", to="help")

    mu-drawer.sidebar(:open="menu", :docked="false", @close="toggle")
      mu-paper
        mu-appbar {{ 'lbl_menu' | translate }}
          mu-icon-button(icon="menu", slot="left", @click="toggle")

      mu-list
        mu-sub-header {{ 'lbl_empire' | translate }}
        mu-list-item(:title="translate('lbl_build')", to="build", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_sorcery')", to="sorcery", @click="toggle")          
          mu-icon(slot="left", value="home")

        mu-sub-header {{ 'lbl_magic' | translate }}
        mu-list-item(:title="translate('lbl_research')", to="research", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_sorcery')", to="sorcery", @click="toggle")          
          mu-icon(slot="left", value="home")

        mu-sub-header {{ 'lbl_encyclopedia' | translate }}
        mu-list-item(:title="translate('lbl_buildings')", to="buildings", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_spells')", to="spells", @click="toggle")
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_units')", to="units", @click="toggle")          
          mu-icon(slot="left", value="home")
        mu-list-item(:title="translate('lbl_items')", to="items", @click="toggle")          
          mu-icon(slot="left", value="home")

    transition(name="router", enter-active-class="animated fadeIn", mode="out-in")
      router-view.router
</template>

<script>
  import store from './vuex/store'
  import i18n from './services/i18n'

  export default {
    name: 'app',
    methods: {
      toggle () {
        store.commit('toggle')
      },
      translate (label) {
        return i18n[store.state.lang][label] || label
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
  @import './css/colors.styl'
  html
  body
    padding 0
    margin 0
    height 100%
    width 100%
    body
      background url("https://s-media-cache-ak0.pinimg.com/originals/9f/4e/38/9f4e38d4634f2b584143be34d1324c0a.png") no-repeat center center fixed
      background-size cover
      box-sizing border-box
      user-select none !important
      z-index -9999
    .topbar
      position fixed
    .router
      padding-top 56px
    @media (min-width 480px)
      .mu-appbar
        height 56px
    .mu-appbar-title
      display flex
      justify-content center
      align-items center
    .mu-card
      opacity 0.85
    .mu-drawer
      .router-link-active
        // TODO
      .mu-sub-header
        line-height 36px
      .mu-item-left
        justify-content center
</style>
