<template lang="pug">
  mu-card.hero
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="contract", v-tooltip="translate('ttp_hero_experience')")
          i.ra.ra-trefoil-lily
          span {{ data.invested | minimize }} / {{ data.experience * data.level | minimize }}
        .card-number(:class="data.color", v-if="tavern", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_hero_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="contract || tavern", v-tooltip="translate('ttp_hero_level')")
          i.ra.ra-trophy
          span {{ data.level | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

      .card-stats(v-if="info")
        mu-chip.triple(v-tooltip="translate('ttp_gold_maintenance')")
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_maintenance')")
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_maintenance')")
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}

    template(v-if="tavern")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || !hasGold || !hasTurns")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="isMine || !hasGold || !hasTurns || !canBid || busy") {{ 'lbl_button_bid' | translate }}

    template(v-if="contract")
      form(@submit.stop.prevent="confirm('fire')")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="busy") {{ 'lbl_button_fire' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from './confirm-dialog'
  
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
            await checkTurnMaintenances(store.state.uid, this.turns)
            await database.ref('tavern').child(this.data['.key']).transaction(auction => {
              if (auction) {
                auction.bid = this.amount
                auction.bidder = store.state.uid
                database.ref('users').child(store.state.uid).transaction(user => {
                  if (user) {
                    user.gold = Math.max(0, user.gold - this.amount)
                    user.turns = Math.max(0, user.turns - 1)
                    // TODO
                  }
                  return user
                })
                return auction
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
