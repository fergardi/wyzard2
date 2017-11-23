<template lang="pug">
  mu-card.artifact(:class="{ 'forbidden': !info && ((auction && isMine || enable && !canActivate)) }")
    mu-card-media
      .card-image(v-once)
        img.lazy(v-lazy-load="picture('artifacts', data.image)", :src="picture('miscellaneous', 'loading')", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="auction", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
        .card-number(:class="data.color", v-if="auction || enable", v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ turns | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_artifact_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="!info", v-tooltip="translate('ttp_artifact_quantity')")
          i.ra.ra-crystals
          span {{ data.quantity | minimize }}
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
          mu-raised-button(primary, type="primary", :disabled="!canSell || busy") {{ 'lbl_button_sell' | translate }}

    template(v-if="enable && tab === 'activate'")
      form(@submit.stop.prevent="confirm('activate')")
        //
          mu-card-text(v-if="!data.battle && !data.support")
            mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true", required)
              mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user.name", :hintText="translate('lbl_label_target')", v-if="!myself(user['.key'])")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="!canActivate || busy") {{ 'lbl_button_activate' | translate }}

    template(v-if="auction")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.bid + 1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || !hasTurns || busy")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="isMine || !canBid || busy") {{ 'lbl_button_bid' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus, addRandomTroopToUserByFamily, removeRandomEnchantmentFromUser, addMessageToUser, addRandomPlaceToUser, addLevelToRandomHeroFromUser, addRandomSpellToUser } from '@/services/api'
  import confirm from '@/components/confirm-dialog'

  export default {
    name: 'artifact-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      info: Boolean,
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
        turns: 1,
        busy: false
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
        this.busy = true
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
      async activate () {
        if (this.hasTurns) { // user has resources
          if (this.canActivate) {
            await checkTurnMaintenances(store.state.uid, this.turns)
            if (this.data) {
              if (this.data.support) { // ally
                if (this.data.summon) {
                  await addRandomTroopToUserByFamily(store.state.uid, this.data.family, this.user.magic)
                } else if (this.data.enchantment) {
                  await removeRandomEnchantmentFromUser(store.state.uid)
                } else if (this.data.place) {
                  await addRandomPlaceToUser(store.state.uid)
                } else if (this.data.level > 0) {
                  await addLevelToRandomHeroFromUser(store.state.uid, this.data.level)
                } else if (this.data.gold > 0 || this.data.people > 0 || this.data.mana > 0) {
                  await database.ref('users').child(store.state.uid).transaction(user => {
                    if (user) {
                      user.gold = Math.floor(user.gold + this.random(this.data.gold))
                      user.people = Math.floor(user.people *= (1 + (this.data.people / 100)))
                      user.mana = Math.floor(user.mana *= (1 + (this.data.mana / 100)))
                    }
                    return user
                  })
                } else if (this.data.terrain > 0) {
                  await database.ref('users').child(store.state.uid).child('constructions').orderByChild('name').equalTo('lbl_building_terrain').once('value', constructions => {
                    if (constructions) {
                      let quantity = this.random(this.data.terrain)
                      constructions.forEach(construction => {
                        construction.ref.update({ quantity: construction.val().quantity + quantity })
                        database.ref('users').child(store.state.uid).update({ terrain: this.user.terrain + quantity })
                      })
                    }
                  })
                } else if (this.data.research) {
                  await addRandomSpellToUser(store.state.uid)
                }
              }
              await database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
                if (artifact) {
                  artifact.quantity-- // decrease quantity
                  if (artifact.quantity <= 0) return null
                }
                return artifact
              })
            }
            await updateGeneralStatus(store.state.uid)
            store.commit('success', 'lbl_toast_activate_ok')
            this.close()
          } else {
            store.commit('error', 'lbl_toast_activate_error')
            this.close()
          }
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      async sell () {
        if (this.hasTurns) { // user has resources
          await checkTurnMaintenances(store.state.uid, this.turns)
          await database.ref('users').child(store.state.uid).child('relics').child(this.data['.key']).transaction(artifact => {
            if (artifact) {
              artifact.quantity--
              let auction = {...artifact} // create an auction
              auction.bid = this.amount // set minimum price
              auction.quantity = 1 // set quantity
              auction.owner = store.state.uid // set owner
              auction.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24)
              database.ref('auctions').push(auction) // insert the auction
              if (artifact.quantity <= 0) return null
            }
            return artifact
          })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_sell_ok')
          this.close()
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      async bid () {
        if (this.hasGold && this.hasTurns) { // user has resources
          if (this.canBid && !this.mine) { // bid accepted
            await database.ref('users').child(store.state.uid).update({ gold: this.user.gold - this.amount })
            await checkTurnMaintenances(store.state.uid, this.turns)
            await database.ref('auctions').child(this.data['.key']).once('value', async auction => {
              if (auction) {
                let auc = auction.val()
                if (auc.bidder) { // if there was a previous bidder
                  await database.ref('users').child(auc.bidder).once('value', async previous => {
                    if (previous) {
                      let artifact = { name: auc.name, color: auc.color }
                      let prev = previous.val()
                      let taxed = Math.floor(auc.bid * 0.9)
                      await database.ref('users').child(auc.bidder).update({ gold: prev.gold + taxed })
                      await addMessageToUser(auc.bidder, 'lbl_name_auction', 'dark', 'lbl_message_auction_outbid', 'lbl_message_auction_outbid_description', null, artifact, taxed)
                    }
                    return previous
                  })
                }
                await database.ref('auctions').child(this.data['.key']).update({
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
        return this.amount > this.data.bid && this.hasTurns && this.hasGold && !this.isMine
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      canActivate () {
        return !this.data.battle && this.hasTurns
      },
      canSell () {
        return this.amount > 0 && this.hasTurns
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
