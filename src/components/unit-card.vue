<template lang="pug">
  mu-card.unit
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="data.quantity != null")
          i.ra.ra-crossed-axes
          span {{ data.quantity | minimize }}
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color")
          i.ra.ra-trophy
          span {{ data.level | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

      .card-stats(v-if="info")
        mu-chip.double
          i.ra.ra-sword
          span {{ data.damage | minimize }}
        mu-chip.double
          i.ra.ra-hearts
          span {{ data.health | minimize }}
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}
        mu-chip.double
          i.ra.ra-gem
          span {{ data.family | translate }}
        mu-chip.double
          i.ra.ra-emerald
          span {{ data.type | translate }}
        mu-chip.simple
          i.ra.ra-sapphire
          span {{ data.evasion ? 'lbl_stat_evasion' : data.frenzy ? 'lbl_stat_frenzy' : data.resurrection ? 'lbl_stat_resurrection' : data.counter ? 'lbl_stat_counter' : data.healing ? 'lbl_stat_healing' : 'lbl_stat_none' | translate }}

    template(v-if="troop")
      form(@submit.stop.prevent="confirm('disband')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="data.quantity", :label="translate('lbl_label_quantity')", :fullWidth="true", required)
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canDisband") {{ 'lbl_button_disband' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/confirm.jpg?alt=media", :alt="translate('lbl_label_confirm')")
          .card-info
            .card-text {{ 'lbl_label_confirm' | translate }}
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
    name: 'unit',
    props: {
      data: Object,
      info: Boolean,
      troop: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'disband':
            this.disband()
            break
        }
      },
      disband () {
        if (this.canDisband) {
          database.ref('users').child(store.state.uid).child('troops').child(this.data['.key']).transaction(unit => {
            if (unit) {
              unit.quantity = Math.max(0, unit.quantity - this.amount)
              if (unit.quantity <= 0) return null
            }
            return unit
          })
          store.commit('success', 'lbl_toast_disband_ok')
        } else {
          store.commit('success', 'lbl_toast_disband_error')
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
