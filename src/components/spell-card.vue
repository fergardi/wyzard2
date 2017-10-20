<template lang="pug">
  mu-card.spell
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="breaking")
          i.ra.ra-hourglass
          span {{ data.remaining | minimize }} / {{ data.duration | minimize }}
        .card-number(:class="data.color", v-if="investigation")
          i.ra.ra-hourglass
          span {{ data.invested | minimize }} / {{ data.completion | minimize }}
        .card-number(:class="data.color", v-if="conjuration")
          i.ra.ra-burst-blob
          span {{ data.manaCost | minimize }}
        .card-number(:class="data.color", v-if="conjuration")
          i.ra.ra-hourglass
          span {{ data.turns | minimize }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | minimize }}
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.magic != null")
          i.ra.ra-trophy
          span {{ data.magic | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}
      
      .card-stats(v-if="info")
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldCost | minimize }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleCost | minimize }}
        mu-chip.triple
          i.ra.ra-burst-blob
          span {{ data.manaCost | minimize }}
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}
        mu-chip.double
          i.ra.ra-hourglass
          span {{ data.turns | minimize }}
        mu-chip.double
          i.ra.ra-stopwatch
          span {{ data.research | minimize }}
        mu-chip.double
          i.ra.ra-lightning-trio
          span {{ data.battle ? 'lbl_stat_battle' : data.summon ? 'lbl_stat_summon' : 'lbl_stat_support' | translate }}
        mu-chip.double
          i.ra.ra-cog
          span {{ data.enchantment ? 'lbl_stat_enchantment' : 'lbl_stat_spell' | translate }}

    template(v-if="investigation")
      form(@submit.stop.prevent="confirm('research')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canResearch || busy") {{ 'lbl_button_research' | translate }}

    template(v-if="conjuration")
      form(@submit.stop.prevent="confirm('conjure')")
        mu-card-text(v-if="!data.support && !data.battle")
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true", required)
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user.name", :hintText="translate('lbl_label_target')", v-if="!myself(user['.key'])")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canCast || busy") {{ 'lbl_button_cast' | translate }}

    template(v-if="breaking")
      form(@submit.stop.prevent="confirm('disenchant')")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canBreak || busy") {{ 'lbl_button_dispel' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from './confirm-dialog'

  export default {
    name: 'spell-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      investigation: Boolean,
      conjuration: Boolean,
      users: Array,
      breaking: Boolean,
      info: Boolean
    },
    data () {
      return {
        busy: false,
        type: null,
        amount: 0,
        dialog: false,
        selected: null
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
          case 'research':
            this.research()
            break
          case 'conjure':
            this.conjure()
            break
          case 'disenchant':
            this.disenchant()
            break
        }
      },
      research () {
        if (this.canResearch) { // user has resources
          let completed = false
          database.ref('users').child(store.state.uid).child('researches').child(this.data['.key']).transaction(research => {
            if (research) {
              let min = research.completion - research.invested
              research.invested = research.invested + Math.min(min, this.amount)
              if (research.invested >= research.completion) {
                completed = true
                let page = {...research}
                delete page['.key']
                database.ref('users').child(store.state.uid).child('book').push(page)
              }
            }
            return research
          })
          .then(response => {
            return checkTurnMaintenances(store.state.uid, this.amount)
          })
          .then(response => {
            if (completed) {
              database.ref('users').child(store.state.uid).child('researches').child(this.data['.key']).remove()
              database.ref('users').child(store.state.uid).child('book').once('value', snapshot => {
                if (snapshot && snapshot.hasChildren() && (1 + Math.floor(snapshot.numChildren() / 2)) > this.user.magic) {
                  database.ref('users').child(store.state.uid).update({ magic: 1 + Math.floor(snapshot.numChildren() / 2) })
                  store.commit('success', 'lbl_toast_investigation_level')
                }
              })
              store.commit('success', 'lbl_toast_investigation_complete')
            } else {
              store.commit('success', 'lbl_toast_investigation_ok')
            }
            this.close()
          })
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      conjure () {
        if (this.canCast) { // user has resources
          if (this.data.summon) { // summon troops
            database.ref('users').child(store.state.uid).child('troops').orderByChild('name').equalTo('lbl_unit_' + this.data.unit).once('value', snapshot => {
              if (snapshot && snapshot.hasChildren()) {
                snapshot.forEach(unit => {
                  database.ref('users').child(store.state.uid).child('troops').child(unit.key).transaction(troop => {
                    if (troop) {
                      troop.quantity += this.random(this.data.number)
                    }
                    return troop
                  })
                })
              } else {
                database.ref('units').child(this.data.unit).once('value', snapshot => {
                  if (snapshot) {
                    let summon = {...snapshot.val()}
                    summon.quantity = this.random(this.data.number)
                    delete summon['.key']
                    database.ref('users').child(store.state.uid).child('troops').push(summon)
                  }
                })
              }
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.gold = Math.max(0, user.gold - this.data.goldCost)
                  user.people = Math.max(0, user.people - this.data.peopleCost)
                  user.mana = Math.max(0, user.mana - this.data.manaCost)
                }
                return user
              })
            })
            .then(response => {
              return checkTurnMaintenances(store.state.uid, this.data.turns)
            })
            .then(response => {
              store.commit('success', 'lbl_toast_casting_ok')
              this.close()
            })
          }
        } else {
          store.commit('success', 'lbl_toast_casting_error')
          this.close()
        }
      },
      async disenchant () {
        if (this.canBreak) { // user has resources
          if (this.data.source === store.state.uid) {
            database.ref('enchantments').child(this.data['.key']).remove()
            await updateGeneralStatus(this.data.target)
            store.commit('success', 'lbl_toast_dispel_ok')
            this.close()
          } else {
            if (Math.random() >= 0.5) {
              database.ref('enchantments').child(this.data['.key']).remove()
              await updateGeneralStatus(this.data.source)
              await checkTurnMaintenances(store.state.uid, this.data.turns)
              store.commit('success', 'lbl_toast_dispel_ok')
              this.close()
            } else {
              await checkTurnMaintenances(store.state.uid, this.data.turns)
              store.commit('error', 'lbl_toast_dispel_error')
              this.close()
            }
          }
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
        this.busy = false
      },
      myself (uid) {
        return store.state.uid === uid
      }
    },
    computed: {
      user () {
        return store.state.user
      },
      settings () {
        return store.state.user ? store.state.user.settings : store.state.settings
      },
      canCast () {
        return this.data.turns <= this.user.turns && this.data.goldCost <= this.user.gold && this.data.peopleCost <= this.user.people && this.data.manaCost <= this.user.mana && !this.data.battle
      },
      canBreak () {
        return this.data.turns <= this.user.turns
      },
      canResearch () {
        return this.amount > 0 && this.amount <= this.user.turns && this.data.magic <= this.user.magic
      }
    },
    destroy () {
      // this.busy = false
    }
  }
</script>

<style lang="stylus" scoped>
</style>
