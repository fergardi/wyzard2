<template lang="pug">
  mu-card.spell
    mu-card-media
      img(:src="data.image")
      #info
        #title(:class="data.color") {{ data.name | translate }}
        #number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
        #number(:class="data.color", v-if="data.remaining != null") {{ data.remaining | numeric }} / {{ data.turns | numeric }}
        #number(:class="data.color", v-if="data.invested != null") {{ data.invested | numeric }} / {{ data.turns | numeric }}
        #number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
    mu-card-text
      p {{ data.description | lorem }}
      .stats(v-if="info")
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
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="research") {{ 'lbl_button_research' | translate }}

    template(v-if="casting")
      mu-card-text
        form
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true")
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user['.key']", :hintText="translate('lbl_label_target')")
      mu-card-actions
        mu-raised-button(primary, @click="cast") {{ 'lbl_button_cast' | translate }}

    template(v-if="breaking")
      mu-card-actions
        mu-raised-button(primary, @click="disenchant") {{ 'lbl_button_dispel' | translate }}
</template>

<script>
  export default {
    name: 'spell',
    props: ['data', 'investigation', 'casting', 'users', 'breaking', 'info'],
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
      },
      disenchant () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
