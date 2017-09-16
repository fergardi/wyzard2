<template lang="pug">
  mu-card.spell.animated.fadeInUp
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
          span {{ 3214325 | numeric }} {{ 'lbl_stat_mana' | translate }}
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

    template(v-if="turns !== undefined && turns >= 0")
      mu-card-text
        mu-linear-progress(mode="determinate", :value="data.turns * 100 / 300")
      mu-card-text
        form
          mu-text-field(type="number", v-model="turns", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="research") {{ 'lbl_button_research' | translate }}

    template(v-if="castable !== undefined && castable === true")
      mu-card-text
        form
          mu-select-field(v-model="selected", :label="translate('lbl_label_mage')", :fullWidth="true")
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user['.key']", :hintText="translate('lbl_label_select')")
      mu-card-actions
        mu-raised-button(primary, @click="cast") {{ 'lbl_button_cast' | translate }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'spell',
    props: ['name', 'turns', 'castable'],
    data () {
      return {
        selected: null
      }
    },
    firebase: {
      users: firebase.ref('users')
    },
    created () {
      this.$bindAsObject('data', firebase.ref('spells').child(this.name))
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
</style>
