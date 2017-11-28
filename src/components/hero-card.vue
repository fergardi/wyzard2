<template lang="pug">
  mu-card.hero(:class="{ 'forbidden': !info && isMine }")
    mu-card-media
      .card-image(v-once)
        img.lazy(v-lazy-load="picture('heroes', data.image)", :src="picture('miscellaneous', 'loading')", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="contract", v-tooltip="translate('ttp_hero_experience')")
          i.ra.ra-trefoil-lily
          span {{ data.invested | minimize }} / {{ data.experience * data.level | minimize }}
        .card-number(:class="data.color", v-if="tavern", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
        .card-number(:class="data.color", v-if="tavern", v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ turns | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_hero_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="contract || tavern", v-tooltip="translate('ttp_hero_level')")
          i.ra.ra-trophy
          span {{ data.level | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

      .card-stats(v-if="info")
        mu-chip.triple(v-tooltip="translate('ttp_gold_maintenance_level')")
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_maintenance_level')")
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_maintenance_level')")
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}

    template(v-if="tavern")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", name="amount", v-validate="'required|numeric'", :errorText="errors.has('amount') ? translate('error_numeric') : ''", v-model.number="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || busy || !hasTurns", :max="user.gold")
        mu-card-actions
          mu-raised-button(primary, @click="confirm('bid')", :disabled="isMine || !hasGold || !hasTurns || !canBid || busy") {{ 'lbl_button_bid' | translate }}

    template(v-if="contract")
      form(@submit.stop.prevent="confirm('fire')")
        mu-card-actions
          mu-raised-button(primary, @click="confirm('fire')", :disabled="busy") {{ 'lbl_button_fire' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus, addMessageToUser } from '@/services/api'
  import confirm from '@/components/confirm-dialog'
  
  export default {
    name: 'hero-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      info: Boolean,
      tavern: Boolean,
      contract: Boolean
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
          case 'bid':
            this.bid()
            break
          case 'fire':
            this.fire()
            break
        }
      },
      async bid () {
        if (this.hasGold && this.hasTurns) { // user has resources
          if (this.canBid && !this.mine) { // bid accepted
            await database.ref('users').child(store.state.uid).update({ gold: this.user.gold - this.amount })
            await checkTurnMaintenances(store.state.uid, this.turns)
            await database.ref('tavern').child(this.data['.key']).once('value', async auction => {
              if (auction) {
                let auc = auction.val()
                if (auc.bidder) { // if there was a previous bidder
                  await database.ref('users').child(auc.bidder).once('value', async previous => {
                    if (previous) {
                      let hero = { name: auc.name, color: auc.color }
                      let prev = previous.val()
                      let taxed = Math.floor(auc.bid * 0.9)
                      await database.ref('users').child(auc.bidder).update({ gold: prev.gold + taxed })
                      await addMessageToUser(auc.bidder, 'lbl_name_tavern', 'dark', 'lbl_message_tavern_outbid', 'lbl_message_tavern_outbid_description', null, null, taxed, null, null, null, null, null, hero)
                    }
                    return previous
                  })
                }
                await database.ref('tavern').child(this.data['.key']).update({
                  bid: this.amount,
                  bidder: store.state.uid,
                  timestamp: this.data.timestamp + 1000 * 60 * 30 // extend the auction 30min
                }) // update the price
              }
            })
            await updateGeneralStatus(store.state.uid)
            store.commit('success', 'lbl_toast_bid_ok')
            this.close()
          } else {
            store.commit('error', 'lbl_toast_bid_error')
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
      async fire () {
        if (this.canFire) { // can fire
          await database.ref('users').child(store.state.uid).child('contracts').child(this.data['.key']).remove()
          store.commit('success', 'lbl_toast_firing_ok')
          this.close()
        } else {
          store.commit('error', 'lbl_toast_firing_error')
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
      user () {
        return store.state.user
      },
      isMine () {
        return this.data.owner === store.state.uid || this.data.bidder === store.state.uid
      },
      hasGold () {
        return this.amount <= this.user.gold
      },
      canBid () {
        return this.amount > this.data.bid
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      canFire () {
        return true
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
