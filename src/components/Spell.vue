<template lang="pug">
  mu-card.spell.animated.fadeInUp(v-if="show")
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
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

    template(v-if="quantity !== undefined && quantity >= 0")
      mu-card-text
        form
          mu-text-field(type="number", v-model="quantity", min="0", required, :label="translate('lbl_label_turns')")
      mu-card-actions.right
        mu-raised-button(primary, @click="research") {{ 'lbl_button_research' | translate }}

    template(v-if="castable !== undefined && castable === true")
      mu-card-text
        form
          mu-select-field(v-model="selected", :label="translate('lbl_label_mage')")
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user['.key']", :hintText="translate('lbl_label_select')")
      mu-card-actions.right
        mu-raised-button(primary, @click="cast") {{ 'lbl_button_cast' | translate }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'spell',
    props: ['name', 'quantity', 'delay', 'castable'],
    data () {
      return {
        show: false,
        selected: null
      }
    },
    firebase: {
      users: firebase.ref('users')
    },
    created () {
      this.$bindAsObject('data', firebase.ref('spells').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * store.state.delay)
    },
    methods: {
      research () {
        // TODO
      },
      cast () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .right
    justify-content flex-end !important
</style>
