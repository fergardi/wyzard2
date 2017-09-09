<template lang="pug">
  mu-card.spell
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
      .stats
        mu-chip
          i.ra.ra-sword
          span {{ 'lbl_stat_level' | translate }} 10
        mu-chip
          i.ra.ra-sword
          span {{ 3214325 | format }} {{ 'lbl_stat_mana' | translate }}
        mu-chip
          i.ra.ra-sword
          span {{ data.category | translate }}
        mu-chip
          i.ra.ra-sword
          span 100 Turnos
        mu-chip
          i.ra.ra-sword
          span 10 Turnos
        mu-chip
          i.ra.ra-sword
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
</style>
