<template lang="pug">
  mu-card.spell
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        .card-number(:class="data.color", v-if="breaking", v-tooltip="translate('ttp_spell_duration')")
          i.ra.ra-hourglass
          span {{ data.remaining | minimize }} / {{ data.duration | minimize }}
        .card-number(:class="data.color", v-if="investigation", v-tooltip="translate('ttp_spell_research')")
          i.ra.ra-hourglass
          span {{ data.invested | minimize }} / {{ data.completion | minimize }}
        .card-number(:class="data.color", v-if="conjuration", v-tooltip="translate('ttp_mana_cost')")
          i.ra.ra-burst-blob
          span {{ data.manaCost * (user.magic || 1) | minimize }}
        .card-number(:class="data.color", v-if="conjuration", v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ data.turns | minimize }}
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_spell_name')") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.magic != null", v-tooltip="translate('ttp_spell_level')")
          i.ra.ra-trophy
          span {{ data.magic | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}
      
      .card-stats(v-if="info")
        mu-chip.triple(v-tooltip="translate('ttp_gold_cost_level')")
          i.ra.ra-gold-bar
          span {{ data.goldCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_cost_level')")
          i.ra.ra-double-team
          span {{ data.peopleCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_cost_level')")
          i.ra.ra-burst-blob
          span {{ data.manaCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_gold_maintenance_level')")
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_maintenance_level')")
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_maintenance_level')")
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}
        mu-chip.double(v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ data.turns | minimize }}
        mu-chip.double(v-tooltip="translate('ttp_spell_research')")
          i.ra.ra-stopwatch
          span {{ data.research | minimize }}
        mu-chip.double(v-tooltip="translate('ttp_spell_type')")
          i.ra.ra-cog
          span {{ data.enchantment ? 'lbl_stat_enchantment' : 'lbl_stat_spell' | translate }}
        mu-chip.double(v-tooltip="translate('ttp_spell_class')")
          i.ra.ra-lightning-trio
          span {{ data.battle ? 'lbl_stat_battle' : data.summon ? 'lbl_stat_summon' : 'lbl_stat_support' | translate }}

    template(v-if="investigation")
      form(@submit.stop.prevent="confirm('research')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true", :disabled="!canLearn || busy")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canResearch || !canLearn || busy") {{ 'lbl_button_research' | translate }}

    template(v-if="conjuration")
      form(@submit.stop.prevent="confirm('conjure')")
        //mu-card-text(v-if="!data.support && !data.battle")
          mu-select-field(v-model="selected", :label="translate('lbl_label_target')", :fullWidth="true", required)
            mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="user.name", :hintText="translate('lbl_label_target')", v-if="!myself(user['.key'])")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canCast || busy") {{ 'lbl_button_cast' | translate }}

    template(v-if="breaking")
      form(@submit.stop.prevent="confirm('disenchant')")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canBreak || busy") {{ 'lbl_button_dispel' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
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
        // selected: null,
        busy: false,
        type: null,
        amount: 0,
        dialog: false
      }
    },
    created () {
      this.$bindAsArray('enchantments', database.ref('enchantments').orderByChild('target').equalTo(store.state.uid))
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
      async research () {
        if (this.canResearch) { // user has resources
          let completed = false
          await checkTurnMaintenances(store.state.uid, this.amount)
          await database.ref('users').child(store.state.uid).child('researches').child(this.data['.key']).transaction(research => {
            if (research) {
              let totalTurns = this.amount
              totalTurns = Math.ceil(totalTurns * (1 + Math.min(0.75, this.user.researchBonus / 100)))
              research.invested += totalTurns
              if (research.invested >= research.completion) {
                completed = true
                research.completed = true
                let page = {...research}
                delete page['.key']
                database.ref('users').child(store.state.uid).child('book').push(page)
              }
            }
            return research
          })
          if (completed) {
            await database.ref('users').child(store.state.uid).child('researches').child(this.data['.key']).remove()
            await database.ref('users').child(store.state.uid).child('book').once('value', book => {
              if (book && book.hasChildren() && Math.floor(book.numChildren() / 2) + 1 > this.user.magic) {
                database.ref('users').child(store.state.uid).update({ magic: Math.min(10, Math.floor(book.numChildren() / 2) + 1) })
                store.commit('success', 'lbl_toast_investigation_level')
              }
            })
            store.commit('success', 'lbl_toast_investigation_complete')
            this.close()
          } else {
            store.commit('success', 'lbl_toast_investigation_ok')
            this.close()
          }
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      async conjure () {
        if (this.canCast) { // user has resources
          await database.ref('users').child(store.state.uid).transaction(user => {
            if (user) {
              user.gold = Math.max(0, user.gold - this.data.goldCost * this.user.magic)
              user.people = Math.max(0, user.people - this.data.peopleCost * this.user.magic)
              user.mana = Math.max(0, user.mana - this.data.manaCost * this.user.magic)
            }
            return user
          })
          await checkTurnMaintenances(store.state.uid, this.data.turns)
          if (this.data.summon) { // summon troops
            if (this.canSummon) {
              let troops = []
              if (this.data.family) {
                await database.ref('units').orderByChild('family').equalTo(this.data.family).once('value', units => {
                  if (units && units.hasChildren()) {
                    units.forEach(unit => {
                      troops.push(unit.val().name)
                    })
                  }
                })
              } else {
                troops.push('lbl_unit_' + this.data.unit)
              }
              const index = Math.floor(Math.random() * troops.length)
              await database.ref('units').child(troops[index].replace('lbl_unit_', '')).once('value', async unit => {
                if (unit) {
                  await database.ref('users').child(store.state.uid).child('troops').orderByChild('name').equalTo(troops[index]).once('value', async units => {
                    if (units && units.hasChildren()) {
                      units.forEach(async uni => {
                        await database.ref('users').child(store.state.uid).child('troops').child(uni.key).update({ quantity: uni.val().quantity + this.random(unit.val().quantity) * this.user.magic })
                      })
                    } else {
                      let summon = {...unit.val()}
                      summon.quantity = this.random(summon.quantity) * this.user.magic
                      delete summon['.key']
                      await database.ref('users').child(store.state.uid).child('troops').push(summon)
                    }
                  })
                }
              })
            } else {
              store.commit('success', 'lbl_toast_army_error')
            }
          } else if (this.data.enchantment && this.data.support) {
            await database.ref('enchantments').orderByChild('target').equalTo(store.state.uid).once('value', enchantments => {
              if (enchantments && enchantments.numChildren() <= this.user.enchantmentCap) {
                let enchantment = {...this.data}
                enchantment.target = store.state.uid
                enchantment.targetColor = this.user.color
                enchantment.targetName = this.user.name
                enchantment.source = store.state.uid
                enchantment.sourceColor = this.user.color
                enchantment.sourceName = this.user.name
                enchantment.magic = this.user.magic
                enchantment.duration *= enchantment.magic
                enchantment.remaining = enchantment.duration
                delete enchantment['.key']
                database.ref('enchantments').push(enchantment)
              }
            })
          } else if (this.data.spell > 0) {
            if (this.data.spell * this.user.magic >= Math.random() * 100) {
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
                database.ref('users').child(store.state.uid).child('researches').push(unknown[index])
              }
            }
          }
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_casting_ok')
          this.close()
        } else {
          store.commit('success', 'lbl_toast_casting_error')
          this.close()
        }
      },
      async disenchant () {
        if (this.canBreak) { // user has resources
          if (this.data.source === store.state.uid) {
            await database.ref('enchantments').child(this.data['.key']).remove()
            await updateGeneralStatus(this.data.target)
            store.commit('success', 'lbl_toast_dispel_ok')
            this.close()
          } else {
            await checkTurnMaintenances(store.state.uid, this.data.turns)
            if (Math.random() >= 0.5) { // TODO
              await database.ref('enchantments').child(this.data['.key']).remove()
              await updateGeneralStatus(this.data.source)
              store.commit('success', 'lbl_toast_dispel_ok')
              this.close()
            } else {
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
      canCast () {
        return this.hasTurns && this.hasGold && this.hasMana && this.hasPeople && this.hasMagic && !this.data.battle && (this.data.enchantment && this.canEnchant || !this.data.enchantment)
      },
      hasTurns () {
        return this.data.turns <= this.user.turns
      },
      hasGold () {
        return this.data.goldCost * this.user.magic <= this.user.gold
      },
      hasMana () {
        return this.data.manaCost * this.user.magic <= this.user.mana
      },
      hasPeople () {
        return this.data.peopleCost * this.user.magic <= this.user.people
      },
      hasMagic () {
        return this.data.magic <= this.user.magic
      },
      canBreak () {
        return this.hasTurns
      },
      canLearn () {
        return this.hasMagic
      },
      canResearch () {
        return this.amount > 0 && this.amount <= this.user.turns
      },
      canEnchant () {
        return this.enchantments && this.enchantments.length <= this.user.enchantmentCap
      },
      canSummon () {
        return this.user.army < this.user.armyCap
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
