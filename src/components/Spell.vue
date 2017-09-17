<template lang="pug">
  mu-card.spell
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
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

    template(v-if="investigation")
      mu-card-text.center
        mu-linear-progress(mode="determinate", :size="6", :value="data.invested * 100 / data.turns")
        small {{ data.invested }} / {{ data.turns }} ({{ data.invested * 100 / data.turns | numeric }} %)
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="research") {{ 'lbl_button_research' | translate }}

    template(v-if="casting")
      mu-card-text
        form
          mu-select-field(v-model="selected", :label="translate('lbl_label_mage')", :fullWidth="true")
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user['.key']", :hintText="translate('lbl_label_select')")
      mu-card-actions
        mu-raised-button(primary, @click="cast") {{ 'lbl_button_cast' | translate }}
</template>

<script>
  export default {
    name: 'spell',
    props: ['data', 'investigation', 'casting', 'users'],
    data () {
      return {
        ammount: 0,
        selected: null
      }
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
