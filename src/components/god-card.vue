<template lang="pug">
  mu-card.god
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color")
          i.ra.ra-gold-bar
          span {{ data.gold | minimize }}
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="pray")
      form(@submit.stop.prevent="confirm('offer')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="!canOffer")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canOffer") {{ 'lbl_button_offer' | translate }}

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
    name: 'god-card',
    props: {
      data: Object,
      pray: Boolean
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
          case 'offer':
            this.offer()
            break
        }
      },
      offer () {
        if (this.hasGold && this.hasTurns) {
          if (this.canOffer) {
            database.ref('gods').child(this.data['.key']).transaction(offer => {
              if (offer) {
                offer.gold = this.amount
                offer.uid = store.state.uid
                database.ref('users').child(store.state.uid).transaction(user => {
                  if (user) {
                    user.gold = Math.max(0, user.gold - this.amount)
                    user.turns = Math.max(0, user.turns - this.turns)
                  }
                  return user
                })
              }
              return offer
            })
            store.commit('success', 'lbl_toast_offer_ok')
          } else {
            store.commit('error', 'lbl_toast_offer_error')
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
