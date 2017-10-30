<template lang="pug">
  mu-card.building
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-extra
        template(v-if="construction || meditation")
          .card-number(v-if="data.name === 'lbl_building_node'", :class="user.mana >= user.manaCap ? 'red' : ''", v-tooltip="translate('ttp_mana_reservation')")
            i.ra.ra-burst-blob
            span {{ user.mana | minimize }} / {{ user.manaCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_barrack'", :class="user.army >= user.armyCap ? 'red' : ''", v-tooltip="translate('ttp_army_reservation')")
            i.ra.ra-crossed-axes
            span {{ user.army | minimize }} / {{ user.armyCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_barrier'", v-tooltip="translate('ttp_magical_bonus')")
            i.ra.ra-eye-shield
            span +{{ data.quantity / data.magicalDefense | percentage }}
          .card-number(v-if="data.name === 'lbl_building_fortress'", v-tooltip="translate('ttp_physical_bonus')")
            i.ra.ra-eye-shield
            span +{{ data.quantity / data.physicalDefense | percentage }}
          .card-number(v-if="data.name === 'lbl_building_guild'", v-tooltip="translate('ttp_research_bonus')")
            i.ra.ra-crystal-ball
            span -{{ data.quantity / data.research | percentage }}
          .card-number(v-if="data.name === 'lbl_building_temple'", v-tooltip="translate('ttp_enchantment_reservation')")
            i.ra.ra-crystals
            span +{{ parseInt(data.quantity / data.enchantmentCap) | minimize }}
          .card-number(v-if="data.name === 'lbl_building_village'", :class="user.people >= user.peopleCap ? 'red' : ''", v-tooltip="translate('ttp_people_reservation')")
            i.ra.ra-double-team
            span {{ user.people | minimize }} / {{ user.peopleCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_workshop'", v-tooltip="translate('ttp_construction_bonus')")
            i.ra.ra-hourglass
            span -{{ data.quantity / data.construction | percentage }}
          .card-number(v-if="data.name === 'lbl_building_farm'", v-tooltip="translate('ttp_gold_reservation')")
            i.ra.ra-gold-bar
            span {{ user.gold | minimize }}
        .card-number(v-if="exploration", v-tooltip="translate('ttp_terrain_production')")
          i.ra.ra-tower
          span +{{ parseInt((data.terrainCap - data.quantity) / 100) | minimize }}
        .card-number(v-if="meditation", v-tooltip="translate('ttp_mana_production')")
          i.ra.ra-burst-blob
          span +{{ data.quantity * data.manaProduction * 2 | minimize }}
        .card-number(v-if="taxation", v-tooltip="translate('ttp_gold_production')")
          i.ra.ra-gold-bar
          span +{{ data.quantity * data.goldProduction * 2 | minimize }}
      .card-info
        .card-text(v-tooltip="translate('ttp_building_name')") {{ data.name | translate }}
        .card-number(v-if="!info", v-tooltip="translate('ttp_building_quantity')")
          i.ra.ra-tower
          span {{ data.quantity | numeric }}
    mu-card-text
      p.card-description(v-if="!exploration && !meditation && !taxation") {{ data.description | translate }}
      p.card-description(v-if="exploration") {{ 'lbl_description_exploration' | translate }}
      p.card-description(v-if="meditation") {{ 'lbl_description_meditation' | translate }}
      p.card-description(v-if="taxation") {{ 'lbl_description_taxation' | translate }}
      
      .card-stats(v-if="info")
        mu-chip.triple(v-tooltip="translate('ttp_gold_cost')")
          i.ra.ra-gold-bar
          span {{ data.goldCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_cost')")
          i.ra.ra-double-team
          span {{ data.peopleCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_cost')")
          i.ra.ra-burst-blob
          span {{ data.manaCost | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_gold_maintenance')")
          i.ra.ra-gold-bar
          span {{ data.goldMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_maintenance')")
          i.ra.ra-double-team
          span {{ data.peopleMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_maintenance')")
          i.ra.ra-burst-blob
          span {{ data.manaMaintenance | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_gold_production')")
          i.ra.ra-gold-bar
          span {{ data.goldProduction | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_people_production')")
          i.ra.ra-double-team
          span {{ data.peopleProduction | minimize }}
        mu-chip.triple(v-tooltip="translate('ttp_mana_production')")
          i.ra.ra-burst-blob
          span {{ data.manaProduction | minimize }}

    template(v-if="construction")
      form(@submit.stop.prevent="confirm('construct')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="-data.quantity", :max="user.terrain", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canConstruct || busy") {{ 'lbl_button_demolish_construct' | translate }}

    template(v-if="exploration")
      form(@submit.stop.prevent="confirm('explore')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canExplore || busy") {{ 'lbl_button_explore' | translate }}

    template(v-if="meditation")
      form(@submit.stop.prevent="confirm('meditate')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canMeditate || busy") {{ 'lbl_button_meditate' | translate }}

    template(v-if="taxation")
      form(@submit.stop.prevent="confirm('collect')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canTax || busy") {{ 'lbl_button_collect' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from './confirm-dialog'

  export default {
    name: 'building-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      info: Boolean,
      data: Object,
      exploration: Boolean,
      construction: Boolean,
      meditation: Boolean,
      taxation: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0,
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
          case 'explore':
            this.explore()
            break
          case 'construct':
            this.construct()
            break
          case 'meditate':
            this.meditate()
            break
          case 'collect':
            this.collect()
            break
        }
      },
      async construct () {
        if (this.amount < 0) {
          await database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).update({ quantity: this.data.quantity - Math.abs(this.amount) })
          await database.ref('users').child(store.state.uid).update({ terrain: this.user.terrain + Math.abs(this.amount) })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_destruction_ok')
          this.close()
        } else if (this.amount > 0) {
          if (this.hasTerrain && this.hasGold && this.hasPeople && this.hasMana) {
            let reduction = 1
            let totalTurns = this.amount * this.data.turns
            await database.ref('users').child(store.state.uid).child('constructions').orderByChild('name').equalTo('lbl_building_workshop').once('value', constructions => {
              if (constructions) {
                constructions.forEach(construction => {
                  let terrain = construction.val()
                  reduction -= Math.min(0.75, (terrain.quantity + 1) / terrain.construction / 100)
                })
              }
            })
            totalTurns = Math.ceil(totalTurns * reduction)
            if (totalTurns <= this.user.turns) {
              await database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.gold -= this.amount * this.data.goldCost
                  user.people -= this.amount * this.data.peopleCost
                  user.mana -= this.amount * this.data.manaCost
                  user.terrain -= this.amount
                }
                return user
              })
              await checkTurnMaintenances(store.state.uid, totalTurns)
              await database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).update({ quantity: this.data.quantity + this.amount })
              await database.ref('users').child(store.state.uid).child('constructions').orderByChild('name').equalTo('lbl_building_terrain').once('value', terrains => {
                if (terrains) {
                  terrains.forEach(terrain => {
                    terrain.ref.update({ quantity: this.user.terrain - this.amount })
                  })
                }
              })
              await updateGeneralStatus(store.state.uid)
              store.commit('success', 'lbl_toast_construction_ok')
              this.close()
            } else {
              store.commit('error', 'lbl_toast_resource_turns')
              this.close()
            }
          } else {
            if (!this.hasTerrain) {
              store.commit('error', 'lbl_toast_resource_terrain')
            }
            if (!this.hasGold) {
              store.commit('error', 'lbl_toast_resource_gold')
            }
            if (!this.hasPeople) {
              store.commit('error', 'lbl_toast_resource_people')
            }
            if (!this.hasMana) {
              store.commit('error', 'lbl_toast_resource_mana')
            }
            this.close()
          }
        }
      },
      async explore () {
        if (this.hasTurns) { // user has resources
          await checkTurnMaintenances(store.state.uid, this.amount)
          await database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).once('value', building => {
            if (building) {
              let terrain = building.val()
              for (let i = 0; i < this.amount; i++) {
                terrain.quantity += Math.max(0, Math.floor((terrain.terrainCap - terrain.quantity) / 100))
              }
              building.ref.update({ quantity: terrain.quantity })
              database.ref('users').child(store.state.uid).update({ terrain: terrain.quantity })
            }
          })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_exploration_ok')
          this.close()
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      async meditate () {
        if (this.hasTurns) { // user has resources
          await checkTurnMaintenances(store.state.uid, this.amount)
          await database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).once('value', building => {
            if (building) {
              let nodes = building.val()
              database.ref('users').child(store.state.uid).update({ mana: Math.min(this.user.manaCap, this.user.mana + nodes.quantity * nodes.manaProduction * this.amount * 2) })
            }
          })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_meditation_ok')
          this.close()
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
          this.close()
        }
      },
      async collect () {
        if (this.hasTurns) { // user has resources
          await checkTurnMaintenances(store.state.uid, this.amount)
          await database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).once('value', building => {
            if (building) {
              let villages = building.val()
              database.ref('users').child(store.state.uid).update({ gold: this.user.gold + villages.quantity * villages.goldProduction * this.amount * 2 })
            }
          })
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_tax_ok')
          this.close()
        } else {
          await updateGeneralStatus(store.state.uid)
          store.commit('error', 'lbl_toast_resource_turns')
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
      hasTerrain () {
        return this.amount <= this.user.terrain
      },
      hasGold () {
        return this.amount * this.data.goldCost <= this.user.gold
      },
      hasPeople () {
        return this.amount * this.data.peopleCost <= this.user.people
      },
      hasMana () {
        return this.amount * this.data.manaCost <= this.user.mana
      },
      hasConstructionTurns () {
        return this.amount * this.data.turns <= this.user.turns
      },
      hasTurns () {
        return this.amount <= this.user.turns
      },
      canExplore () {
        return this.amount > 0 && this.amount <= this.user.turns
      },
      canMeditate () {
        return this.amount > 0 && this.amount <= this.user.turns
      },
      canTax () {
        return this.amount > 0 && this.amount <= this.user.turns
      },
      canConstruct () {
        return this.amount > 0
          ? this.hasGold && this.hasPeople && this.hasMana && this.hasTerrain
          : this.amount < 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
