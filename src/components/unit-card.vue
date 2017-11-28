<template lang="pug">
  mu-card.unit
    mu-card-media
      .card-image(v-once)
        img.lazy(v-lazy-load="picture('units', data.image)", :src="picture('miscellaneous', 'loading')", :alt="translate(data.name)")
      .card-extra
        .card-number(v-if="troop", :class="data.color", v-tooltip="translate('ttp_unit_quantity')")
          i.ra.ra-crossed-axes
          span {{ data.quantity | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_unit_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-tooltip="translate('ttp_unit_level')")
          i.ra.ra-trophy
          span {{ data.level | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

      .card-stats(v-if="info")
        mu-chip.double(v-tooltip="translate('ttp_unit_damage')")
          i.ra.ra-sword
          span {{ data.damage | minimize }}
        mu-chip.double(v-tooltip="translate('ttp_unit_health')")
          i.ra.ra-hearts
          span {{ data.health | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_gold_maintenance')")
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_maintenance')")
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_maintenance')")
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}
        mu-chip.double(v-tooltip="translate('ttp_unit_family')")
          i.ra.ra-gem
          span {{ data.family | translate }}
        mu-chip.double(v-tooltip="translate('ttp_unit_type')")
          i.ra.ra-emerald
          span {{ data.type | translate }}
      //
        mu-chip.simple(v-tooltip="translate('ttp_unit_skill')")
          i.ra.ra-sapphire
          span {{ data.evasion ? 'lbl_stat_evasion' : data.frenzy ? 'lbl_stat_frenzy' : data.resurrection ? 'lbl_stat_resurrection' : data.counter ? 'lbl_stat_counter' : data.healing ? 'lbl_stat_healing' : 'lbl_stat_none' | translate }}

    template(v-if="troop")
      form(@submit.stop.prevent="confirm('disband')")
        mu-card-text
          mu-text-field(type="number", name="troop_quantity", v-validate="'required|numeric'", :errorText="errors.has('troop_quantity') ? translate('error_numeric') : ''", v-model.number="amount", min="1", :max="data.quantity", :label="translate('lbl_label_quantity')", :fullWidth="true", required)
        mu-card-actions
          mu-raised-button(primary, @click="confirm('disband')", :disabled="!canDisband || busy") {{ 'lbl_button_disband' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import confirm from '@/components/confirm-dialog'
  import { updateGeneralStatus } from '@/services/api'

  export default {
    name: 'unit',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      info: Boolean,
      troop: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0,
        busy: false
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
        switch (this.type) {
          case 'disband':
            this.disband()
            break
        }
      },
      async disband () {
        if (this.canDisband) {
          await database.ref('users').child(store.state.uid).child('troops').child(this.data['.key']).transaction(unit => {
            if (unit) {
              unit.quantity = Math.max(0, unit.quantity - this.amount)
              if (unit.quantity <= 0) {
                database.ref('users').child(store.state.uid).child('defense').child('first').remove()
                database.ref('users').child(store.state.uid).child('defense').child('second').remove()
                database.ref('users').child(store.state.uid).child('defense').child('third').remove()
                database.ref('users').child(store.state.uid).child('defense').child('fourth').remove()
                database.ref('users').child(store.state.uid).child('defense').child('fifth').remove()
                return null
              }
            }
            return unit
          })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_disband_ok')
          this.close()
        } else {
          store.commit('success', 'lbl_toast_disband_error')
          this.close()
        }
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
        this.busy = false
      }
    },
    computed: {
      settings () {
        return store.state.user ? store.state.user.settings : store.state.settings
      },
      canDisband () {
        return this.amount > 0 && this.amount <= this.data.quantity
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
