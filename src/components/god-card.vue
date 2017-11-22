<template lang="pug">
  mu-card.god(:class="{ 'forbidden': !info && isMine }")
    mu-card-media
      .card-image
        img.lazy(v-lazy-load="picture('gods', data.image)", :src="picture('miscellaneous', 'loading')", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="pray", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
        .card-number(:class="data.color", v-if="pray", v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ turns | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_god_name')") {{ data.name | translate }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="pray")
      form(@submit.stop.prevent="confirm('offer')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.bid + 1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine")
        mu-card-actions
          mu-raised-button(primary, @click="confirm('offer')", :disabled="!canOffer || busy") {{ 'lbl_button_offer' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus, addMessageToUser } from '@/services/api'
  import confirm from '@/components/confirm-dialog'

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
                if (offer.blessed) {
                  let god = { name: offer.name, color: offer.color }
                  addMessageToUser(offer.blessed, 'lbl_name_devotion', 'dark', 'lbl_message_devotion_outbid', 'lbl_message_devotion_outbid_description', null, null, null, null, null, null, null, null, null, god)
                }
                offer.blessed = store.state.uid
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
        return this.amount > this.data.bid && !this.isMine
      },
      isMine () {
        return store.state.uid === this.data.blessed
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
