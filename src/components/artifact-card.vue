<template lang="pug">
  mu-card.artifact
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="auction", v-tooltip="translate('ttp_gold_bid')")
          i.ra.ra-gold-bar
          span {{ data.bid | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_artifact_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="!info", v-tooltip="translate('ttp_artifact_quantity')")
          i.ra.ra-vase
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
          mu-raised-button(primary, type="primary", :disabled="!hasTurns || !canSell || busy") {{ 'lbl_button_sell' | translate }}

    template(v-if="enable && tab === 'activate'")
      form(@submit.stop.prevent="confirm('activate')")
        mu-card-text(v-if="!data.battle && !data.support")
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true", required)
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user.name", :hintText="translate('lbl_label_target')", v-if="!myself(user['.key'])")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="!hasTurns || !canActivate || busy") {{ 'lbl_button_activate' | translate }}

    template(v-if="auction")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.gold + 1", :max="user.gold", required, :label="translate('lbl_resource_gold')", :fullWidth="true", :disabled="isMine || !hasGold || !hasTurns || busy")
        mu-card-actions
          mu-raised-button(primary, type="primary", :disabled="isMine || !hasGold || !hasTurns || !canBid || busy") {{ 'lbl_button_bid' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from './confirm-dialog'

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
                  await database.ref('units').orderByChild('family').equalTo(this.data.family).once('value', units => {
                    if (units) {
                      let summons = []
                      units.forEach(unit => {
                        let summon = {...unit.val()}
                        summon.quantity = this.random(summon.quantity * this.user.magic)
                        delete summon['.key']
                        summons.push(summon)
                      })
                      const index = Math.floor(Math.random() * summons.length)
                      let summon = summons[index]
                      database.ref('users').child(store.state.uid).child('troops').orderByChild('name').equalTo(summon.name).once('value', troops => {
                        if (troops && troops.hasChildren()) {
                          troops.forEach(troop => {
                            troop.ref.update({ quantity: troop.val().quantity + summon.quantity })
                          })
                        } else {
                          database.ref('users').child(store.state.uid).child('troops').push(summon)
                        }
                      })
                    }
                  })
                } else if (this.data.enchantment) {
                  await database.ref('enchantments').orderByChild('target').equalTo(store.state.uid).once('value', enchantments => {
                    if (enchantments && enchantments.hasChildren()) {
                      let enchant = []
                      enchantments.forEach(enchantment => {
                        enchant.push(enchantment.key)
                      })
                      const index = Math.floor(Math.random() * enchant.length)
                      database.ref('enchantments').child(enchant[index]).remove()
                    }
                  })
                } else if (this.data.place) {
                  await database.ref('places').once('value', places => {
                    let quests = []
                    places.forEach(place => {
                      let quest = {...place.val()}
                      quest.turns = this.random(20)
                      delete quest['.key']
                      quests.push(quest)
                    })
                    const index = Math.floor(Math.random() * quests.length)
                    database.ref('users').child(store.state.uid).child('quests').push(quests[index])
                  })
                } else if (this.data.level > 0) {
                  await database.ref('users').child(store.state.uid).child('contracts').once('value', contracts => {
                    if (contracts && contracts.hasChildren()) {
                      let heroes = []
                      contracts.forEach(contract => {
                        heroes.push(contract.key)
                      })
                      const index = Math.floor(Math.random() * heroes.length)
                      database.ref('users').child(store.state.uid).child('contracts').child(heroes[index]).transaction(hero => {
                        if (hero) {
                          hero.level++
                        }
                        return hero
                      })
                    }
                  })
                } else if (this.data.gold > 0 || this.data.people > 0 || this.data.mana > 0) {
                  await database.ref('users').child(store.state.uid).transaction(user => {
                    if (user) {
                      user.gold += this.random(this.data.gold)
                      user.people *= 1 + (this.data.people / 100)
                      user.mana *= 1 + (this.data.mana / 100)
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
                  let known = []
                  await database.ref('users').child(store.state.uid).child('researches').once('value', researches => {
                    if (researches) {
                      researches.forEach(research => {
                        known.push(research.val().name)
                      })
                    }
                  })
                  await database.ref('users').child(store.state.uid).child('book').once('value', book => {
                    if (book) {
                      book.forEach(page => {
                        known.push(page.val().name)
                      })
                    }
                  })
                  let unknown = []
                  await database.ref('spells').once('value', spells => {
                    if (spells) {
                      spells.forEach(spell => {
                        if (!known.includes(spell.val().name)) {
                          let research = {...spell.val()}
                          delete research['.key']
                          unknown.push(research)
                        }
                      })
                    }
                  })
                  if (unknown.length > 0) {
                    const index = Math.floor(Math.random() * unknown.length)
                    await database.ref('users').child(store.state.uid).child('researches').push(unknown[index])
                  }
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
              database.ref('auctions').push(auction) // insert the auction
            }
            if (artifact.quantity <= 0) return null
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
            await checkTurnMaintenances(store.state.uid, this.turns)
            await database.ref('auctions').child(this.data['.key']).transaction(auction => {
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
                database.ref('users').child(store.state.uid).update({ gold: this.user.gold - this.amount })
              }
              return auction
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
        return this.amount > this.data.bid
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      canActivate () {
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
