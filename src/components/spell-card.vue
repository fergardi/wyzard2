<template lang="pug">
  mu-card.spell
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
        .card-number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
        .card-number(:class="data.color", v-if="breaking") {{ data.remaining | numeric }} / {{ data.turns | numeric }}
        .card-number(:class="data.color", v-if="investigation") {{ data.invested | numeric }} / {{ data.turns | numeric }}
    mu-card-text
      p {{ data.description | lorem }}
      .card-stats(v-if="info")
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
      form(@submit.stop.prevent="confirm('research')")
        mu-card-text
            mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_research' | translate }}

    template(v-if="conjuration")
      form(@submit.stop.prevent="confirm('conjure')")
        mu-card-text
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true")
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user['.key']", :hintText="translate('lbl_label_target')")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_cast' | translate }}

    template(v-if="breaking")
      form(@submit.stop.prevent="confirm('disenchant')")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_dispel' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-header(:title="translate('lbl_label_confirm')", :subTitle="translate('lbl_label_cannot_undo')")
        mu-card-actions
          mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close")
          mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'spell-card',
    props: {
      data: Object,
      investigation: Boolean,
      conjuration: Boolean,
      users: Array,
      breaking: Boolean,
      info: Boolean
    },
    data () {
      return {
        type: null,
        amount: 0,
        dialog: false,
        selected: null
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'research':
            this.research()
            break
          case 'conjure':
            this.conjure()
            break
          case 'disenchant':
            this.disenchant()
            break
        }
      },
      research () {
        database.ref('users').child(store.state.uid).child('researches').child(this.data['.key']).transaction(research => {
          let min = research.turns - research.invested
          research.invested = research.invested + Math.min(min, this.amount)
          if (research.invested >= research.turns) research.completed = true
          database.ref('users').child(store.state.uid).child('turns').transaction(turns => {
            return Math.max(0, turns - Math.min(min, this.amount))
          })
          return research
        })
        store.commit('success', 'lbl_toast_investigation_ok')
        this.close()
      },
      conjure () {
        // TODO
        store.commit('success', 'lbl_toast_casting_ok')
        this.close()
      },
      disenchant () {
        // TODO
        store.commit('success', 'lbl_toast_dispel_ok')
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
