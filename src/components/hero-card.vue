<template lang="pug">
  mu-card.hero
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="contract")
          i.ra.ra-trefoil-lily
          span {{ data.invested | minimize }} / {{ data.experience * data.level | minimize }}
        .card-number(:class="data.color", v-if="tavern")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="contract || tavern")
          i.ra.ra-trophy
          span {{ data.level | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

      .card-stats(v-if="info")
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}

    template(v-if="tavern")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || !hasGold || !hasTurns")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="isMine || !hasGold || !hasTurns || !canBid") {{ 'lbl_button_bid' | translate }}

    template(v-if="contract")
      form(@submit.stop.prevent="confirm('fire')")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_fire' | translate }}

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
    name: 'hero-card',
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
        turns: 1
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'bid':
            this.bid()
            break
          case 'fire':
            this.fire()
            break
        }
      },
      bid () {
        if (this.hasGold && this.hasTurns) { // user has resources
          if (this.canBid && !this.mine) { // bid accepted
            database.ref('tavern').child(this.data['.key']).transaction(auction => {
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
            store.commit('success', 'lbl_toast_bid_ok')
          } else {
            store.commit('error', 'lbl_toast_bid_error')
          }
        } else {
          if (!this.hasGold) {
            store.commit('error', 'lbl_toast_resource_gold')
          }
          if (!this.hasTurns) {
            store.commit('error', 'lbl_toast_resource_turns')
          }
        }
        this.close()
      },
      fire () {
        if (this.canFire) { // can fire
          database.ref('users').child(store.state.uid).child('contracts').child(this.data['.key']).transaction(contract => {
            return null
          })
          store.commit('success', 'lbl_toast_firing_ok')
        } else {
          store.commit('error', 'lbl_toast_firing_error')
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
