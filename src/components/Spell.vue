<template lang="pug">
  mu-card.spell.animated.fadeInUp(v-if="show")
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
  import firebase from '../services/firebase'

  export default {
    name: 'spell',
    props: ['name', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('spells').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * 50)
    }
  }
</script>

<style lang="stylus" scoped>
</style>
