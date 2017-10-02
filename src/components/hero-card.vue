<template lang="pug">
  mu-card.hero
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
    mu-card-text
      p {{ data.description | translate }}

    template(v-if="contract")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_bid' | translate }}

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
    name: 'hero-card',
    props: {
      data: Object,
      contract: Boolean
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
          case 'bid':
            this.bid()
            break
        }
      },
      bid () {
        database.ref('tavern').child(this.data['.key']).transaction(auction => {
          auction.gold = this.amount
          auction.uid = store.state.uid
          database.ref('users').child(store.state.uid).transaction(user => {
            user.gold = Math.max(0, user.gold - this.amount)
            user.turns = Math.max(0, user.turns - 1)
            return user
          })
          return auction
        })
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
