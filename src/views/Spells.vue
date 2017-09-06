<template lang="pug">
  .help
    mu-card.spell(v-for="spell, index in spells", :key="index")
      mu-card-header(:title="translate(spell.faction.name)", :subTitle="translate(spell.type)")
        mu-avatar(:src="spell.faction.image", slot="avatar")
      mu-card-media(:title="translate(spell.name)", :subTitle="translate(spell.category)")
        img(:src="spell.image")
      mu-card-text
        p {{ spell.description | lorem }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'
  import i18n from '../services/i18n'
  
  export default {
    name: 'Spells',
    created () {
      store.commit('title', 'lbl_spells')
    },
    firebase: {
      spells: firebase.ref('spells')
    },
    methods: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    },
    filters: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    }
  }
</script>

<style lang="stylus">
  .spell
    margin 5px
    border-radius 5px
</style>
