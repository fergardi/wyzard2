<template lang="pug">
  mu-card.god
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(v-if="pray", :class="data.color", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_god_name')") {{ data.name | translate }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="pray")
      form(@submit.stop.prevent="confirm('offer')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="!canOffer")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canOffer || busy") {{ 'lbl_button_offer' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from './confirm-dialog'

  export default {
    name: 'god-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      info: Boolean,
      pray: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0,
        turns: 1,
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
          case 'offer':
            this.offer()
            break
        }
      },
      async offer () {
        if (this.hasGold && this.hasTurns) {
          if (this.canOffer) {
            await database.ref('users').child(store.state.uid).update({ gold: this.user.gold - this.amount })
            await checkTurnMaintenances(store.state.uid, this.turns)
            await database.ref('gods').child(this.data['.key']).transaction(offer => {
              if (offer) {
                offer.bid = this.amount
                if (offer.uid) updateGeneralStatus(offer.uid)
                offer.uid = store.state.uid
              }
              return offer
            })
            await updateGeneralStatus(store.state.uid)
            store.commit('success', 'lbl_toast_offer_ok')
            this.close()
          } else {
            store.commit('error', 'lbl_toast_offer_error')
            this.close()
          }
        } else {
          if (!this.hasGold) {
            store.commit('error', 'lbl_toast_resource_gold')
            this.close()
          }
          if (!this.hasTurns) {
            store.commit('error', 'lbl_toast_resource_turns')
            this.close()
          }
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
      user () {
        return store.state.user
      },
      hasGold () {
        return this.amount <= this.user.gold
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      canOffer () {
        return this.amount > this.data.gold && store.state.uid === this.data.uid
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
