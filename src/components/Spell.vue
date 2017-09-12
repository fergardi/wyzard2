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
    template(v-if="quantity !== undefined")
      mu-card-text
        form
          mu-text-field(type="number", v-model="quantity", min="0", required, :label="translate('lbl_label_turns')")
      mu-card-actions.right
        mu-raised-button(primary, @click="research") {{ 'lbl_button_research' | translate }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'spell',
    props: ['name', 'quantity', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('spells').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * store.state.delay)
    }
  }
</script>

<style lang="stylus" scoped>
  .right
    justify-content flex-end !important
</style>
