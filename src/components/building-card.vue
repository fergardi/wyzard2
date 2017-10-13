<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-extra
        template(v-if="construction || meditation")
          .card-number(v-if="data.name === 'lbl_building_node'", :class="user.mana >= data.quantity * data.manaCap ? 'red' : ''")
            i.ra.ra-burst-blob
            span {{ user.mana | minimize }} / {{ data.quantity * data.manaCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_barrack'", :class="user.army >= data.quantity * data.armyCap ? 'red' : ''")
            i.ra.ra-crossed-axes
            span {{ user.army | minimize }} / {{ data.quantity * data.armyCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_barrier'")
            i.ra.ra-eye-shield
            span +{{ data.quantity / data.magicalDefenseBonus | percentage }}
          .card-number(v-if="data.name === 'lbl_building_fortress'")
            i.ra.ra-eye-shield
            span +{{ data.quantity / data.physicalDefenseBonus | percentage }}
          .card-number(v-if="data.name === 'lbl_building_guild'")
            i.ra.ra-crystal-ball
            span -{{ data.quantity / data.researchBonus | percentage }}
          .card-number(v-if="data.name === 'lbl_building_temple'")
            i.ra.ra-crystals
            span +{{ parseInt(data.quantity / data.enchantmentCap) | minimize }}
          .card-number(v-if="data.name === 'lbl_building_village'", :class="user.people >= data.quantity * data.peopleCap ? 'red' : ''")
            i.ra.ra-double-team
            span {{ user.people | minimize }} / {{ data.quantity * data.peopleCap | minimize }}
          .card-number(v-if="data.name === 'lbl_building_workshop'")
            i.ra.ra-hourglass
            span -{{ data.quantity / data.constructionBonus | percentage }}
          .card-number(v-if="data.name === 'lbl_building_farm'")
            i.ra.ra-gold-bar
            span {{ user.gold | minimize }}
        .card-number(v-if="exploration")
          i.ra.ra-tower
          span +{{ parseInt((data.terrainCap - data.quantity) / 100) | minimize }}
        .card-number(v-if="meditation")
          i.ra.ra-burst-blob
          span +{{ data.quantity * data.manaProduction * 2 | minimize }}
        .card-number(v-if="taxation")
          i.ra.ra-gold-bar
          span +{{ data.quantity * data.goldProduction * 2 | minimize }}
      .card-info
        .card-text {{ data.name | translate }}
        .card-number(v-if="data.quantity != null")
          i.ra.ra-tower
          span {{ data.quantity | minimize }}
    mu-card-text
      p.card-description(v-if="!exploration && !meditation && !taxation") {{ data.description | translate }}
      p.card-description(v-if="exploration") {{ 'lbl_description_exploration' | translate }}
      p.card-description(v-if="meditation") {{ 'lbl_description_meditation' | translate }}
      p.card-description(v-if="taxation") {{ 'lbl_description_taxation' | translate }}
      
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
        mu-chip.triple
          i.ra.ra-gold-bar
          span {{ data.goldProduction | minimize }}
        mu-chip.triple
          i.ra.ra-double-team
          span {{ data.peopleProduction | minimize }}
        mu-chip.triple
          i.ra.ra-burst-blob
          span {{ data.manaProduction | minimize }}

    template(v-if="construction")
      form(@submit.stop.prevent="confirm('construct')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="-data.quantity", :max="user.terrain", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canConstruct") {{ 'lbl_button_demolish_construct' | translate }}

    template(v-if="exploration")
      form(@submit.stop.prevent="confirm('explore')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canExplore") {{ 'lbl_button_explore' | translate }}

    template(v-if="meditation")
      form(@submit.stop.prevent="confirm('meditate')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canMeditate") {{ 'lbl_button_meditate' | translate }}

    template(v-if="taxation")
      form(@submit.stop.prevent="confirm('collect')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="user.turns", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit", :disabled="!canTax") {{ 'lbl_button_collect' | translate }}

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
    name: 'building-card',
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
        tooltip: false,
        trigger: null,
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
      construct () {
        if (this.hasTerrain) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  if (this.amount > 0) {
                    if (this.hasGold && this.hasPeople && this.hasMana && this.hasTurns) {
                      building.quantity += Math.min(user.terrain, this.amount)
                      user.terrain -= Math.min(user.terrain, this.amount)
                      user.turns = Math.max(0, user.turns - Math.abs(this.amount * this.data.turns))
                    } else {
                      if (!this.hasTurns) {
                        store.commit('error', 'lbl_toast_resource_turns')
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
                    }
                  } else {
                    user.terrain += Math.min(building.quantity, Math.abs(this.amount))
                    building.quantity -= Math.min(building.quantity, Math.abs(this.amount))
                  }
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_construction_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_terrain')
        }
        this.close()
      },
      explore () {
        if (this.hasTurns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              for (let i = 0; i < this.amount; i++) {
                building.quantity += Math.max(0, Math.floor((building.terrainCap - building.quantity) / 100))
              }
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.terrain = building.quantity
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_exploration_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      meditate () {
        if (this.hasTurns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  let meditation = building.quantity * building.manaProduction * this.amount * 2
                  if (user.mana + meditation >= building.quantity * building.manaCap) {
                    store.commit('error', 'lbl_toast_meditation_error')
                  }
                  user.mana = Math.min(building.quantity * building.manaCap, user.mana + meditation)
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_meditation_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      collect () {
        if (this.hasTurns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.gold += building.quantity * building.goldProduction * this.amount * 2
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_tax_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
      },
      hover (reference) {
        console.log(this.$refs, reference)
        this.trigger = this.$refs[reference]
        this.tooltip = true
      },
      exit () {
        this.tooltip = false
        this.trigger = null
      }
    },
    computed: {
      user () {
        return store.state.user
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
      hasTerrain () {
        return this.amount <= this.user.terrain
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
          ? this.hasGold && this.hasPeople && this.hasMana && this.amount * this.data.turns <= this.user.turns
          : this.amount < 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
