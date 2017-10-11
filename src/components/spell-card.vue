<template lang="pug">
  mu-card.spell
    mu-card-media
      img(:src="settings.cartoon ? data.cartoon : data.image", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="breaking")
          i.ra.ra-hourglass
          span {{ data.remaining | numeric }} / {{ data.turns | numeric }}
        .card-number(:class="data.color", v-if="investigation")
          i.ra.ra-hourglass
          span {{ data.invested | numeric }} / {{ data.turns | numeric }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.level != null")
          i.ra.ra-trophy
          span {{ data.level | numeric }}
    mu-card-text
      p.card-description {{ data.description | translate }}
      
      .card-stats(v-if="info")
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldCost | numeric }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleCost | numeric }}
        mu-chip.triple
          i.ra.ra-droplet
          span {{ data.manaCost | numeric }}
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | numeric }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | numeric }}
        mu-chip.triple
          i.ra.ra-droplet
          span {{ data.manaMaintenance | numeric }}
        mu-chip.double
          i.ra.ra-hourglass
          span {{ data.turns | numeric }}
        mu-chip.double
          i.ra.ra-clockwork
          span {{ data.research | numeric }}
        mu-chip.double
          i.ra.ra-lightning-trio
          span {{ data.battle ? 'lbl_stat_battle' : data.summon ? 'lbl_stat_summon' : 'lbl_stat_support' | translate }}
        mu-chip.double
          i.ra.ra-cog
          span {{ data.enchantment ? 'lbl_stat_enchantment' : 'lbl_stat_spell' | translate }}

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
        mu-card-media
          img(src="https://static1.squarespace.com/static/5356aa98e4b0e10db1993391/t/535b376de4b0482b3e27feb8/1398486899036/Sign+in+Blood.jpg", :alt="translate('lbl_label_confirm')")
          .card-info
            .card-title {{ 'lbl_label_confirm' | translate }}
        mu-card-text
          p {{ 'lbl_label_cannot_undo' | translate }}
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
        selected: null,
        turns: 10
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
        if (this.turns <= this.user.turns) { // user has resources
          database.ref('users').child(store.state.uid).child('enchantments').child(this.data['.key']).transaction(enchantment => {
            if (enchantment) {
              if (Math.random() >= 0.5) {
                store.commit('success', 'lbl_toast_dispel_ok')
              } else {
                store.commit('error', 'lbl_toast_dispel_error')
              }
            }
            return enchantment
          })
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
      }
    },
    computed: {
      user () {
        return store.state.user
      },
      settings () {
        return store.state.user ? store.state.user.settings : store.state.settings
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
