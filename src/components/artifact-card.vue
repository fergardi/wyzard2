<template lang="pug">
  mu-card.artifact
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    mu-card-text(v-if="enable")
      mu-tabs(:value="tab", @change="change")
        mu-tab(value="activate", :title="translate('lbl_tab_activate')")
        mu-tab(value="sell", :title="translate('lbl_tab_sell')")

    template(v-if="enable && tab === 'sell'")
      form(@submit.stop.prevent="confirm('sell')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="primary") {{ 'lbl_button_sell' | translate }}

    template(v-if="enable && tab === 'activate'")
      form(@submit.stop.prevent="confirm('activate')")
        mu-card-actions
          mu-raised-button(primary, type="primary") {{ 'lbl_button_activate' | translate }}

    template(v-if="auction")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="primary") {{ 'lbl_button_bid' | translate }}

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
        amount: 0
      }
    },
    created () {
      if (this.auction) this.amount = this.data.gold
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
        database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
          artifact.quantity -= 1
          if (artifact.quantity <= 0) {
            artifact.remove()
          }
          // TODO
          database.ref('users').child(store.state.uid).transaction(user => {
            user.turns = Math.max(0, user.turns - 1)
            return user
          })
          return artifact
        })
        store.commit('success', 'lbl_toast_activate_ok')
        this.close()
      },
      sell () {
        database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
          artifact.quantity -= 1
          let auction = {...artifact}
          auction.gold = this.amount
          auction.quantity = 1
          auction.uid = store.state.uid
          database.ref('auctions').push(auction)
          database.ref('users').child(store.state.uid).transaction(user => {
            user.turns = Math.max(0, user.turns - 1)
            return user
          })
          return artifact
        }).then(transaction => {
          if (transaction.snapshot.val().quantity <= 0) {
            database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).remove()
          }
        })
        store.commit('success', 'lbl_toast_sell_ok')
        this.close()
      },
      bid () {
        // TODO
        store.commit('success', 'lbl_toast_bid_ok')
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
