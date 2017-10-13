<template lang="pug">
  mu-card.artifact
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="auction")
          i.ra.ra-gold-bar
          span {{ data.gold | numeric }}
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null")
          i.ra.ra-vase
          span {{ data.quantity | numeric }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    mu-card-text(v-if="enable")
      mu-tabs(:value="tab", @change="change")
        mu-tab(value="activate", :title="translate('lbl_tab_activate')")
        mu-tab(value="sell", :title="translate('lbl_tab_sell')")

    template(v-if="enable && tab === 'sell'")
      form(@submit.stop.prevent="confirm('sell')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="!hasTurns")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="!hasTurns || !canSell") {{ 'lbl_button_sell' | translate }}

    template(v-if="enable && tab === 'activate'")
      form(@submit.stop.prevent="confirm('activate')")
        mu-card-text(v-if="!data.battle && !data.support")
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true", required)
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user.name", :hintText="translate('lbl_label_target')", v-if="!myself(user['.key'])")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="!hasTurns || !canActive") {{ 'lbl_button_activate' | translate }}

    template(v-if="auction")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.gold + 1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || !hasGold || !hasTurns")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="isMine || !hasGold || !hasTurns || !canBid") {{ 'lbl_button_bid' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-media
          img(src="https://static1.squarespace.com/static/5356aa98e4b0e10db1993391/t/535b376de4b0482b3e27feb8/1398486899036/Sign+in+Blood.jpg", :alt="translate('lbl_label_confirm')")
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
    name: 'artifact-card',
    props: {
      data: Object,
      quantity: Number,
      auction: Boolean,
      enable: Boolean,
      store: Boolean
    },
    data () {
      return {
        tab: 'activate',
        dialog: false,
        type: null,
        amount: 0,
        turns: 1
      }
    },
    methods: {
      change (tab) {
        this.tab = tab
        this.amount = 0
      },
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'activate':
            this.activate()
            break
          case 'sell':
            this.sell()
            break
          case 'bid':
            this.bid()
            break
        }
      },
      activate () {
        if (this.hasTurns) { // user has resources
          database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
            if (artifact) {
              artifact.quantity -= 1 // decrease quantity
              // TODO
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.turns = Math.max(0, user.turns - 1) // decrease turns
                  // TODO
                }
                return user
              })
            }
            return artifact
          })
          .then(transaction => {
            if (transaction.snapshot.val().quantity <= 0) { // if no quantity left
              database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).remove() // remove the artifact
            }
          })
          store.commit('success', 'lbl_toast_activate_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      sell () {
        if (this.hasTurns) { // user has resources
          database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
            if (artifact) {
              artifact.quantity -= 1 // decrease quantity
              let auction = {...artifact} // create an auction
              auction.gold = this.amount // set minimum price
              auction.quantity = 1 // set quantity
              auction.owner = store.state.uid // set owner
              database.ref('auctions').push(auction) // insert the auction
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.turns = Math.max(0, user.turns - 1) // update the user
                  // TODO
                }
                return user
              })
            }
            return artifact
          }).then(transaction => {
            if (transaction.snapshot.val().quantity <= 0) { // if no quantity left
              database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).remove() // remove the artifact
            }
          })
          store.commit('success', 'lbl_toast_sell_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      bid () {
        if (this.hasGold && this.hasTurns) { // user has resources
          if (this.canBid && !this.mine) { // bid accepted
            database.ref('auctions').child(this.data['.key']).transaction(auction => {
              if (auction) {
                if (auction.bidder) { // if there was a previous bidder
                  database.ref('users').child(store.state.uid).transaction(previous => {
                    if (previous) {
                      let taxed = auction.gold * 0.9
                      previous.gold += taxed // return him/her the bid minus a 10% fee
                      let message = { // create new message
                        color: 'dark',
                        subject: 'lbl_message_auction_outbid',
                        text: 'lbl_message_auction_outbid_text',
                        timestamp: Date.now(),
                        name: 'lbl_name_auction',
                        attachment: {
                          item: 'lbl_resource_gold',
                          quantity: taxed
                        }
                      }
                      previous.child('messages').push(message) // add message to previous bidder
                    }
                  })
                }
                auction.gold = this.amount // update the price
                auction.bidder = store.state.uid // update the bidder
                database.ref('users').child(store.state.uid).transaction(user => {
                  if (user) {
                    user.gold = Math.max(0, user.gold - this.amount) // decrease gold
                    user.turns = Math.max(0, user.turns - 1) // decrease turns
                    // TODO
                  }
                  return user
                })
              }
              return auction
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
        return this.amount > this.data.gold
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      canActive () {
        return !this.data.battle
      },
      canSell () {
        return this.amount > 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
